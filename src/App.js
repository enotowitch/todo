import React from "react"
import AddTodo from "./components/AddTodo"
import OneDayTodos from "./components/OneDayTodos"
import data from "./localStorageData"
import allDaysList from "./allDaysList"
import getCookie from "./functions/getCookie"

export default function App() {

	const [todos, setTodos] = React.useState(data)

	const daysHtmlElements = allDaysList.map(elem => <OneDayTodos todos={todos} action={action} date={elem} moveTodo={moveTodo} />)

	function addTodo(inputText, quantity) {
		// ! date
		const date = getCookie("dateForAddTodo")
		// ? date
		// ! add MANY
		if (inputText.match(",") && quantity === "many") {
			const arr = inputText.split(",")
			for (let i = 0; i < arr.length; i++) {
				setTodos(prevState => {
					return [...prevState, { id: prevState.length + 1, date: date, text: arr[i], isLiked: false, isDone: false, isHidden: false }]
				})
				localStorage.setItem(todos.length + 1 + i, JSON.stringify({ id: todos.length + 1 + i, date: date, text: arr[i], isLiked: false, isDone: false, isHidden: false }))
			}
			return false
		}
		// ! add SINGLE
		setTodos(prevState => {
			return [...prevState, { id: prevState.length + 1, date: date, text: inputText, isLiked: false, isDone: false, isHidden: false }]
		})
		localStorage.setItem(todos.length + 1, JSON.stringify({ id: todos.length + 1, date: date, text: inputText, isLiked: false, isDone: false, isHidden: false }))
	}
	// ! action: propName: isDone/isLiked/isHidden,etc... works only with BOOLS!
	function action(todoID, propName) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, [propName]: !elem[propName] } : elem
			})
		})
		// localStorage
		const curTodoStr = localStorage.getItem(todoID)
		const curTodoObj = JSON.parse(curTodoStr)
		curTodoObj[propName] = !curTodoObj[propName]
		localStorage.setItem(todoID, JSON.stringify(curTodoObj))
		// style .todos-title .propName
		const todosTitle = document.querySelector(`[class*=${propName}]`)
		todosTitle && !todosTitle.classList.contains('turned-on') ? todosTitle.click() : console.log('do nothing')
		todosTitle && todosTitle.classList.remove(propName)
	}
	// ! moveTodo
	function moveTodo(todoID, downOrUp) {
		// localStorage
		const storageObj = JSON.parse(localStorage.getItem(todoID))

		const curTodoDate = storageObj.date
		const curDateInd = allDaysList.indexOf(curTodoDate)
		const dayDown = allDaysList[curDateInd + 1]
		const dayUp = allDaysList[curDateInd - 1]
		const newDay = downOrUp == "down" ? dayDown : dayUp

		storageObj.date = newDay
		localStorage.setItem(todoID, JSON.stringify(storageObj))

		// state
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, date: newDay } : elem
			})
		})
	}

	React.useEffect(() => {
		// scroll to today
		const dateObj = new Date()
		const dateToScroll = dateObj.toLocaleString('en', { month: 'long' }) + dateObj.getDate()
		const headerHeight = document.querySelector('.add-todo').offsetHeight
		document.querySelector(`.${dateToScroll}`).scrollIntoView()
		window.scrollBy(0, -headerHeight)
	}, [])

	React.useEffect(() => {
		// style chosen-day set in cookie "dateForAddTodo"
		const dateChosen = getCookie("dateForAddTodo").replace(/\s/, '')
		document.querySelector(`.${dateChosen}`).classList.add('chosen-day')
	}, [])

	return (
		<>
			<AddTodo addTodo={addTodo} />
			{daysHtmlElements}
		</>
	)
}
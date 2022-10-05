import React from "react"
import AddTodo from "./components/AddTodo"
import OneDayTodos from "./components/OneDayTodos"
import data from "./localStorageData"
import allDaysList from "./allDaysList"

export default function App() {

	const [todos, setTodos] = React.useState(data)

	const daysHtmlElements = allDaysList.map(elem => <OneDayTodos todos={todos} action={action} date={elem} />)

	function addTodo(inputText, quantity) {
		// ! date
		const date = document.cookie.match(/dateForAddTodo=\w*\s\d*/)[0].replace('dateForAddTodo=', '')
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

	React.useEffect(() => {
		const dateObj = new Date()
		const date = dateObj.toLocaleString('en', { month: 'long' }) + dateObj.getDate()
		const headerHeight = document.querySelector('.add-todo').offsetHeight
		document.querySelector(`.${date}`).scrollIntoView()
		window.scrollBy(0, -headerHeight)
	}, [])

	return (
		<>
			<AddTodo addTodo={addTodo} />
			{daysHtmlElements}
		</>
	)
}
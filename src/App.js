import React from "react"
import AddTodo from "./components/AddTodo"
import OneDayTodos from "./components/OneDayTodos"
import data from "./localStorageData"
import allDaysList from "./allDaysList"
import getCookie from "./functions/getCookie"
import getToday from "./functions/getToday"
import ChangeWeek from "./components/ChangeWeek"

export default function App() {

	// default cookies
	if (!document.cookie.match(/colors/)) {
		document.cookie = ` colors={"work":"#7ec5fb","my task name":"#ff8585","editable text":"#aeffa3"};`
	}
	if (!document.cookie.match(/tasks/)) {
		document.cookie = `tasks={"task1":"work","task2":"my task name","task3":"editable text"};`
	}

	let curWeekNum
	allDaysList.map((elem, ind) => elem.includes(getToday()) && (curWeekNum = ind))

	React.useEffect(() => {
		// on reload AddTodo adds to today
		document.cookie = `dateForAddTodo=${getToday()}`
	}, [])

	const [todos, setTodos] = React.useState(data)
	const [weekNum, setWeekNum] = React.useState(curWeekNum)

	const daysHtmlElements = allDaysList[weekNum].map(elem => <OneDayTodos todos={todos} action={action} date={elem} moveTodo={moveTodo} />)

	function addTodo(inputText, quantity) {
		// ! date
		const date = getCookie("dateForAddTodo")
		// ? date
		if (inputText === "" && quantity === "one") {
			inputText = `Test Task ${localStorage.length + 1}`
		}
		if (inputText === "" && quantity === "many") {
			inputText = `Test Task ${localStorage.length + 1}, Test Task ${localStorage.length + 2}, Test Task ${localStorage.length + 3}`
		}
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
		const curDateInd = allDaysList[weekNum].indexOf(curTodoDate)
		const dayDown = allDaysList[weekNum][curDateInd + 1]
		const dayUp = allDaysList[weekNum][curDateInd - 1]
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
		setTimeout(() => {
			const headerHeight = document.querySelector('.add-todo').offsetHeight
			document.querySelector(`.${getToday()}`).scrollIntoView()
			window.scrollBy(0, -headerHeight)
		}, 500);
	}, [])

	React.useEffect(() => {
		// style chosen-day set in cookie "dateForAddTodo"
		const dateChosen = getCookie("dateForAddTodo")
		document.querySelector(`.${dateChosen}`).classList.add('chosen-day')
	}, [])

	function changeWeek(nextOrPrev) {
		nextOrPrev === "next" ? setWeekNum(prevState => prevState + 1) : setWeekNum(prevState => prevState - 1)
	}

	return (
		<>
			<AddTodo addTodo={addTodo} todos={todos} />
			{/* todo arrow classes */}
			<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
			{daysHtmlElements}
			<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
		</>
	)
}
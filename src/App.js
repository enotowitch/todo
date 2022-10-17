import React from "react"
import AddTodo from "./components/AddTodo"
import OneDayTodos from "./components/OneDayTodos"
import data from "./localStorageData"
import allDaysList from "./allDaysList"
import getCookie from "./functions/getCookie"
import getToday from "./functions/getToday"
import ChangeWeek from "./components/ChangeWeek"
import Menu from "./components/Menu"
import PopUp from "./components/PopUp"
import normalizeDate from "./functions/normalizeDate"
import makePopUp from "./functions/makePopUp"

export default function App() {

	// default cookies
	if (!document.cookie.match(/colors/)) {
		document.cookie = ` colors={"work":"#7ec5fb","buy":"#ff8585","cook":"#aeffa3"};`
	}
	if (!document.cookie.match(/tasks/)) {
		document.cookie = `tasks={"task1":"work","task2":"buy","task3":"cook"};`
	}

	let curWeekNum
	allDaysList.map((elem, ind) => elem.includes(getToday()) && (curWeekNum = ind))

	React.useEffect(() => {
		// on reload AddTodo adds to today
		document.cookie = `dateForAddTodo=${getToday()}`
	}, [])

	const [todos, setTodos] = React.useState(data)

	React.useEffect(() => {
		Object.values(todos).map(elem => {
			localStorage.setItem(elem.id, JSON.stringify(elem))
		})
	}, [todos])

	const [weekNum, setWeekNum] = React.useState(curWeekNum)

	const [popUpState, setPopUpState] = React.useState({})
	const [showPopUp, setShowPopUp] = React.useState(false)

	const daysHtmlElements = allDaysList[weekNum].map(elem => <OneDayTodos todos={todos} action={action} date={elem} moveTodo={moveTodo} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />)

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
			}
		}
		if (quantity === "one") {
			// ! add ONE
			setTodos(prevState => {
				return [...prevState, { id: prevState.length + 1, date: date, text: inputText, isLiked: false, isDone: false, isHidden: false }]
			})
		}
		// ! PopUp
		makePopUp("plus", normalizeDate(date), inputText, setPopUpState, setShowPopUp)
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
		// todo remove localStorage.setItem
		// localStorage.setItem(todoID, JSON.stringify(curTodoObj))
		// style .todos-title .propName
		const todosTitle = document.querySelector(`[class*=${propName}]`)
		todosTitle && !todosTitle.classList.contains('turned-on') ? todosTitle.click() : console.log('do nothing')
		todosTitle && todosTitle.classList.remove(propName)
		// ! PopUp
		makePopUp(propName, propName.slice(2), curTodoObj.text, setPopUpState, setShowPopUp)
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
		// todo remove localStorage.setItem
		// localStorage.setItem(todoID, JSON.stringify(storageObj))

		// state
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, date: newDay } : elem
			})
		})
		// ! PopUp
		makePopUp(downOrUp, normalizeDate(newDay), storageObj.text, setPopUpState, setShowPopUp)
	}

	React.useEffect(() => {
		// scroll to today
		setTimeout(() => {
			document.querySelector(`.${getToday()}`).scrollIntoView()
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

	const [showAddTodo, setShowAddTodo] = React.useState(false)
	function toggleShowAddTodo() {
		setShowAddTodo(prevState => !prevState)
	}

	function popUpHide() {
		setShowPopUp(false)
	}

	return (
		<>
			<Menu toggleShowAddTodo={toggleShowAddTodo} />

			{showAddTodo && <AddTodo addTodo={addTodo} todos={todos} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />}
			{/* todo arrow classes */}
			<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
			{daysHtmlElements}
			<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
			{showPopUp && <PopUp {...popUpState} popUpHide={popUpHide} todos={todos} setTodos={setTodos} />}
		</>
	)
}
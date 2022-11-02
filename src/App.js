import React from "react"
import AddTodo from "./components/AddTodo"
import OneDayTodos from "./components/OneDayTodos"
import data from "./localStorageData"
import weeks from "./weeks"
import getCookie from "./functions/getCookie"
import getToday from "./functions/getToday"
import ChangeWeek from "./components/ChangeWeek"
import Burger from "./components/Burger"
import PopUp from "./components/PopUp"
import normalizeDate from "./functions/normalizeDate"
import makePopUp from "./functions/makePopUp"
import Search from "./components/Search"
import Scroll from "./components/Scroll"
import translate from './functions/translate'

const t = translate()

export default function App() {

	// ! default cookies
	if (!document.cookie.match(/colors/)) {
		document.cookie = `colors={"work":"#7ec5fb","buy":"#ff8585","cook":"#aeffa3"};`
	}
	if (!document.cookie.match(/tasks/)) {
		document.cookie = `tasks={"task1":"work","task2":"buy","task3":"cook"};`
	}
	if (!document.cookie.match(/lastTodo/)) {
		document.cookie = `lastTodo="0"`
	}
	if (!document.cookie.match(/translate/)) {
		document.cookie = `translate="UA"`
	}
	// ? default cookies

	let curWeekNum
	weeks.map((elem, ind) => elem.includes(getToday()) && (curWeekNum = ind))

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

	const daysHtmlElements = weeks[weekNum].map(elem => <OneDayTodos todos={todos} action={action} date={elem} moveTodo={moveTodo} moveTask={moveTask} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} toggleAction={toggleAction} />)

	function addTodo(inputText, quantity) {
		let lastTodo
		lastTodo = document.cookie.match(/lastTodo="\d+/) && document.cookie.match(/lastTodo="\d+/)[0].replace(/lastTodo="/, '') * 1
		// ! date
		const date = getCookie("dateForAddTodo")
		// ? date
		if (inputText === "" && quantity === "one") {
			inputText = `Test Task ${lastTodo + 1}`
		}
		// ! define task
		// todo HAS DUP
		const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace(/tasks=/, ''))

		const tasksArr = []
		Object.values(tasksObj).map(elem => tasksArr.push(elem)) // ['taskName1', 'taskName2', 'taskName3']

		const firstWord = inputText.match(/\S+/)[0]
		let task
		tasksArr.map(taskName => taskName === firstWord && (task = firstWord, inputText = inputText.replace(firstWord, '')))
		// ? define task

		if (quantity === "one") {
			// ! add ONE
			lastTodo++

			setTodos(prevState => {
				return [...prevState, { task: task, id: lastTodo, date: date, text: inputText, doing: false, done: false, canceled: false, showAction: false }]
			})
		}
		document.cookie = `lastTodo="${lastTodo}"`
		// ! PopUp
		makePopUp({ imgName: "add", title: normalizeDate(date), text: inputText, setPopUpState, setShowPopUp })
	}
	// ! action: propName: done/doing/canceled,etc... works only with BOOLS!
	function action(todoID, propName, propNameTranslated) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, doing: false, done: false, canceled: false, [propName]: !elem[propName] } : elem
			})
		})
		// localStorage
		const curTodoStr = localStorage.getItem(todoID)
		const curTodoObj = JSON.parse(curTodoStr)
		curTodoObj[propName] = !curTodoObj[propName]
		// todo remove localStorage.setItem
		// localStorage.setItem(todoID, JSON.stringify(curTodoObj))
		// ! PopUp
		makePopUp({ imgName: propName, title: propNameTranslated, text: curTodoObj.text, setPopUpState, setShowPopUp })
	}
	function toggleAction(todoId) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoId ? { ...elem, showAction: !elem.showAction } : { ...elem, showAction: false }
			})
		})
	}
	// ! moveTodo
	function moveTodo(todoId, newDate) {
		// state
		setTodos(prevState => prevState.map(elem => {
			return elem.id === todoId ? { ...elem, date: newDate } : elem
		}))
		// PopUp
		makePopUp({ imgName: "add", title: normalizeDate(newDate), text: todos[todoId - 1].text, setPopUpState, setShowPopUp })
	}
	// ! moveTask
	function moveTask(todoId, newTask) {
		// state
		setTodos(prevState => prevState.map(elem => {
			return elem.id === todoId ? { ...elem, task: newTask } : elem
		}))
		// PopUp
		newTask = newTask === "undefined" ? t[19] : newTask
		makePopUp({ imgName: "add", title: newTask, text: todos[todoId - 1].text, setPopUpState, setShowPopUp })
	}
	// todo
	// React.useEffect(() => {
	// 	// style chosen-day set in cookie "dateForAddTodo"
	// 	const dateChosen = getCookie("dateForAddTodo")
	// 	document.querySelector(`.${dateChosen}`).classList.add('chosen-day')
	// }, [])

	function changeWeek(nextOrPrev) {
		nextOrPrev === "next" ? setWeekNum(prevState => prevState + 1) : setWeekNum(prevState => prevState - 1)
	}

	const [showAddTodo, setShowAddTodo] = React.useState(false)
	function toggleAddTodo() {
		setShowAddTodo(prevState => !prevState)
	}

	function popUpHide() {
		setShowPopUp(false)
	}

	const [showWeek, setShowWeek] = React.useState(true)
	function toggleWeek() {
		setShowWeek(prevState => !prevState)
	}

	return (
		<>
			<Burger toggleAddTodo={toggleAddTodo} />

			{showAddTodo && <AddTodo addTodo={addTodo} todos={todos} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />}

			{showWeek &&
				<>
					<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
					{daysHtmlElements}
					<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
				</>
			}
			{showPopUp && <PopUp {...popUpState} popUpHide={popUpHide} todos={todos} setTodos={setTodos} />}

			<Search showWeek={showWeek} toggleWeek={toggleWeek} todos={todos} action={action} moveTodo={moveTodo} moveTask={moveTask} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} toggleAction={toggleAction} />
			<Scroll />
		</>
	)
}
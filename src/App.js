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
import { Context } from "./context"
import defineLang from "./functions/defineLang"

const t = translate()

export default function App() {

	// ! default cookies
	if (!document.cookie.match(/colors/)) {
		document.cookie = `colors={"work":"#7ec5fb","buy":"#ff8585","cook":"#aeffa3"};`
	}
	if (!document.cookie.match(/tasks=\[.+?]/)) {
		const date = new Date()
		// todo - en,uk - instead of EN,UA
		const month = date.toLocaleString('uk', { month: 'long' }).toLowerCase()
		document.cookie = `tasks=[{work: "#aeffa3"},{ideas: "#7ec5fb"}, {${month}: "#ff8585"}]`
	}
	if (!document.cookie.match(/lastTodo/)) {
		document.cookie = `lastTodo="3"`
	}
	if (!document.cookie.match(/translate/)) {
		document.cookie = `translate="UA"`
	}
	if (localStorage.length === 0) {
		// create FAKE todos on start for DRAG & DROP to status title
		localStorage.setItem(0, JSON.stringify({ id: 0, doing: false, done: false, canceled: false }))
		localStorage.setItem(1, JSON.stringify({ id: 1, doing: true, done: false, canceled: false }))
		localStorage.setItem(2, JSON.stringify({ id: 2, doing: false, done: true, canceled: false }))
		localStorage.setItem(3, JSON.stringify({ id: 3, doing: false, done: false, canceled: true }))
		// mandatory
		window.location.reload()
	}
	// ? default cookies

	let curWeekNum
	weeks.EN.map((elem, ind) => elem.includes(getToday()) && (curWeekNum = ind))

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

	const lang = defineLang()

	const daysHtmlElements = weeks.EN[weekNum].map((day, ind) => <OneDayTodos todos={todos} action={action} date={day} dateTranslated={weeks[lang][weekNum][ind]} moveTodo={moveTodo} moveTask={moveTask} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} toggleAction={toggleAction} />)

	function addTodo(inputText, quantity) {
		let lastTodo
		lastTodo = document.cookie.match(/lastTodo="\d+/) && document.cookie.match(/lastTodo="\d+/)[0].replace(/lastTodo="/, '') * 1
		// ! date
		const date = getCookie("dateForAddTodo")
		// ? date
		if (inputText === "" && quantity === "one") {
			inputText = `Test Task ${lastTodo - 3 + 1}`
		}
		// ! define task
		const firstWord = inputText.match(/\S+/)[0]
		let task
		tasks.map(tsk => Object.keys(tsk) == firstWord && (task = firstWord, inputText = inputText.replace(firstWord, '')))
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
	function moveTodo(todoId, newDate, newDateTranslated) {
		// state
		setTodos(prevState => prevState.map(elem => {
			return elem.id === todoId ? { ...elem, date: newDate } : elem
		}))
		// PopUp
		makePopUp({ imgName: "add", title: normalizeDate(newDateTranslated), text: todos[todoId].text, setPopUpState, setShowPopUp })
	}
	// ! moveTask
	function moveTask(todoId, newTask) {
		// state
		setTodos(prevState => prevState.map(elem => {
			return elem.id === todoId ? { ...elem, task: newTask } : elem
		}))
		// PopUp
		newTask = newTask === "undefined" ? t[19] : newTask
		makePopUp({ imgName: "add", title: newTask, text: todos[todoId].text, setPopUpState, setShowPopUp })
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
	// ! draggable
	const [draggable, setDraggable] = React.useState(false)
	// ! mobile (touch int) => detect to show drag & drop (.dnd) icon; on desktop all todo is draggable, on mobile icon is draggable 
	const [mobile, setMobile] = React.useState(false)

	React.useEffect(() => {
		function fn() {
			setMobile(true)
		}
		document.body.addEventListener('touchstart', fn)
	}, [])

	const [oneTime, setOneTime] = React.useState(0)

	// prevent todo to be draggable on mobile on load
	if (mobile === true && oneTime === 0) {
		setDraggable(false)
		setOneTime(prevState => prevState + 1)
	}
	// ? mobile
	// ! tasks
	const cookieTasks = document.cookie.match(/tasks=\[.+?]/)[0].replace(/tasks=/, '')
	const [tasks, setTasks] = React.useState(eval(cookieTasks))

	// ! return
	return (
		<Context.Provider value={{ todos, setTodos, draggable, setDraggable, mobile, tasks, setTasks }}>
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
		</Context.Provider>
	)
}
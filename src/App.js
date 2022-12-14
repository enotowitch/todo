/* 
TO SEE COMMENTS (! = start, ? = end) INSTALL EXTENSION:
Name: Better Comments
Id: aaron-bond.better-comments 
*/


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
import makePopUp from "./functions/makePopUp"
import Search from "./components/Search"
import Scroll from "./components/Scroll"
import translate from './functions/Translate'
import { Context } from "./context"
import defineLang from "./functions/defineLang"
import defineLocation from "./functions/defineLocation"
import SearchIcon from "./components/SearchIcon"
import setCookie from "./functions/setCookie"
import dateTranslate from "./functions/dateTranslate"


export default function App() {

	const t = translate()

	// ! lang
	const [lang, setLang] = React.useState(defineLang()) // UK, EN ...
	React.useEffect(() => {
		setCookie(`lang="${lang}"`)
		// rewrite dateTranslated on lang change
		const date = getCookie("dateForAddTodo") // Nov 17
		const dateTranslated = dateTranslate(date, lang)
		setCookie(`dateTranslated=${dateTranslated}`)
	}, [lang])
	// ? lang

	// ! default cookies => on first load
	if (!document.cookie.match(/lang=/)) {
		setCookie(`lang="${defineLocation()}"`)
	}
	if (!document.cookie.match(/tasks=\[.+?]/)) {
		const date = new Date()
		const month = date.toLocaleString(lang, { month: 'long' }).toLowerCase()
		setCookie(`tasks=[{${t[71]}: "#aeffa3"},{${t[72]}: "#7ec5fb"}, {${month}: "#ff8585"}]`)
	}
	if (!document.cookie.match(/lastTodo/)) {
		setCookie(`lastTodo="3"`) // ids 0-3 are for FAKE todos, used in DRAG & DROP
	}
	if (!document.cookie.match(/dateForAddTodo/)) {
		setCookie(`dateForAddTodo=${getToday()}`)
	}
	if (localStorage.length === 0) {
		// create FAKE todos on start for DRAG & DROP
		localStorage.setItem(0, JSON.stringify({ id: 0, doing: false, done: false, canceled: false, year: new Date().getFullYear() }))
		localStorage.setItem(1, JSON.stringify({ id: 1, doing: true, done: false, canceled: false, year: new Date().getFullYear() }))
		localStorage.setItem(2, JSON.stringify({ id: 2, doing: false, done: true, canceled: false, year: new Date().getFullYear() }))
		localStorage.setItem(3, JSON.stringify({ id: 3, doing: false, done: false, canceled: true, year: new Date().getFullYear() }))
		// mandatory
		window.location.reload()
	}
	if (!document.cookie.match(/showDate=/)) {
		setCookie(`showDate=${true}`)
	}
	if (!document.cookie.match(/showTask=/)) {
		setCookie(`showTask=${true}`)
	}
	// ? default cookies

	// ! curWeekNum, dateForAddTodo
	let curWeekNum
	weeks.map((elem, ind) => elem.includes(getToday()) && (curWeekNum = ind))

	React.useEffect(() => {
		// on reload AddTodo adds to today
		setCookie(`dateForAddTodo=${getToday()}`)
	}, [])
	// ? curWeekNum, dateForAddTodo

	// ! todos, weekNum
	const [todos, setTodos] = React.useState(data)

	React.useEffect(() => {
		Object.values(todos).map(todo => {
			localStorage.setItem(todo.id, JSON.stringify(todo))
		})
	}, [todos])

	const [weekNum, setWeekNum] = React.useState(curWeekNum)
	// ? todos, weekNum

	// ! popUp
	const [popUpState, setPopUpState] = React.useState({})
	const [showPopUp, setShowPopUp] = React.useState(false)
	// ? popUp

	// show change lang popup ONLY at very first load
	const [x1, x1Set] = React.useState(1)
	if (!document.cookie.match(/langPopUp/) && x1 === 1) {
		makePopUp({ title: t[30], setPopUpState, setShowPopUp, modalWindowType: "select", showTask: false })
		x1Set(2)
	}

	const daysHtmlElements = weeks[weekNum].map((day) => <OneDayTodos date={day} />)

	// ! addTodo
	function addTodo() {
		let lastTodo
		lastTodo = document.cookie.match(/lastTodo="\d+/) && document.cookie.match(/lastTodo="\d+/)[0].replace(/lastTodo="/, '') * 1
		// ! date
		const date = getCookie("dateForAddTodo")
		// ? date
		const text = inputOfAddTodo && inputOfAddTodo.trim() || `${t[68]} ${lastTodo - 3 + 1}`
		lastTodo++

		const task = taskForAddTodo && taskForAddTodo.trim().replace(/\s{2,}/, ' ')

		setTodos(prevState => {
			return [...prevState, { task: task, id: lastTodo, date: date, year: yearForAddTodo, text: text, doing: false, done: false, canceled: false, showAction: false }]
		})

		setCookie(`lastTodo="${lastTodo}"`)
		// PopUp
		const dateTranslated = getCookie("dateTranslated")
		makePopUp({ imgName: "add", title: dateTranslated + " - " + t[0], text: text, setPopUpState, setShowPopUp, todoId: lastTodo })
	}
	// ? addTodo
	// ! action: propName: done/doing/canceled,etc... works only with BOOLS!
	function action(todoId, propName, propNameTranslated) {
		let status
		let text
		setTodos(prevState => {
			return prevState.map(todo => {
				todo.id === todoId && (status = !todo[propName])
				todo.id === todoId && (text = todo.text)
				return todo.id === todoId ? { ...todo, doing: false, done: false, canceled: false, [propName]: !todo[propName] } : todo
			})
		})
		// PopUp
		// show correct status in makePopUp
		if (!status) { // doing/done/canceled === false => status is todo
			propName = "add"
			propNameTranslated = t[0]
		}
		makePopUp({ imgName: propName, title: propNameTranslated, text: text, setPopUpState, setShowPopUp, todoId: todoId })
	}
	// ? action
	// ! toggleAction
	function toggleAction(todoId) {
		setTodos(prevState => {
			return prevState.map(todo => {
				return todo.id === todoId ? { ...todo, showAction: !todo.showAction } : { ...todo, showAction: false }
			})
		})
	}
	// ? toggleAction
	// ! moveTodo
	function moveTodo(todoId, newDate, newDateTranslated) {
		const date = newDate.match(/\w+\s\d+/)[0]
		const newYear = newDate.match(/\d{4}/)[0]
		// state
		let text
		let oldDate
		let oldYear
		setTodos(prevState => prevState.map(todo => {
			if (todo.id === todoId) {
				text = todo.text
				oldDate = todo.date
				oldYear = todo.year
			}
			return todo.id === todoId ? { ...todo, date: date, year: newYear } : todo
		}))
		const oldDateTranslated = dateTranslate(oldDate, lang)
		// PopUp
		makePopUp({ imgName: "date", title: oldDateTranslated + ", " + oldYear + "->" + newDateTranslated, text: text, setPopUpState, setShowPopUp, todoId: todoId })
	}
	// ? moveTodo
	// ! moveTask
	function moveTask(todoId, newTask) {
		// state
		let text
		let dateTranslated
		setTodos(prevState => prevState.map(todo => {
			if (todo.id === todoId) {
				text = todo.text
				dateTranslated = dateTranslate(todo.date, lang)
			}
			return todo.id === todoId ? { ...todo, task: newTask } : todo
		}))
		// PopUp
		makePopUp({ imgName: "task", title: dateTranslated, text: text, setPopUpState, setShowPopUp, todoId: todoId })
	}
	// ? moveTask

	// ! year & changeWeek
	// null the year to current, once at reload
	x1 === 1 && (setCookie(`yearForAddTodo=${new Date().getFullYear()}`))

	const cookieYear = Number(document.cookie.match(/yearForAddTodo=\d+/)[0].replace(/yearForAddTodo=/, ''))
	const [yearForAddTodo, setYearForAddTodo] = React.useState(cookieYear)

	function changeWeek(nextOrPrev) {
		nextOrPrev === "next" ? setWeekNum(prevState => prevState + 1) : setWeekNum(prevState => prevState - 1)
		if (weekNum === 52 && nextOrPrev === "next") {
			setWeekNum(0)
			setYearForAddTodo(prevState => prevState + 1)
		}
		if (weekNum === 0 && nextOrPrev === "prev") {
			setWeekNum(52)
			setYearForAddTodo(prevState => prevState - 1)
		}
	}
	React.useEffect(() => {
		setCookie(`yearForAddTodo=${yearForAddTodo}`)
	}, [yearForAddTodo])
	// ? year & changeWeek

	// ! draggable
	const [draggable, setDraggable] = React.useState(false)
	// ! mobile (touch int) => detect to show drag & drop (.dnd) icon; on desktop all todos are draggable, on mobile icon is draggable 
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
		setOneTime(1)
	}
	// ? mobile
	// ! tasks
	const cookieTasks = document.cookie.match(/tasks=\[.+?]/)[0].replace(/tasks=/, '')
	const [tasks, setTasks] = React.useState(eval(cookieTasks))

	React.useEffect(() => {
		setCookie(`tasks=${JSON.stringify(tasks)}`)
	}, [tasks])
	// ? tasks

	// ! taskForAddTodo, inputOfAddTodo, showSection
	const [taskForAddTodo, setTaskForAddTodo] = React.useState()
	const [inputOfAddTodo, setInputOfAddTodo] = React.useState()
	const [showSection, setShowSection] = React.useState({ addTodo: false, week: true, search: false })
	// ? taskForAddTodo, inputOfAddTodo, showSection

	// ! showDate
	const cookieShowDate = document.cookie.match(/showDate=\w+/)[0].replace(/showDate=/, '')
	const [showDate, setShowDate] = React.useState(eval(cookieShowDate))
	// ? showDate
	// ! showTask
	const cookieShowTask = document.cookie.match(/showTask=\w+/)[0].replace(/showTask=/, '')
	const [showTask, setShowTask] = React.useState(eval(cookieShowTask))
	// ? showTask

	// ! other
	// prevent fake-todo from dragging
	React.useEffect(() => {
		document.querySelectorAll('.fake-todo').forEach((elem) => {
			setTimeout(() => {
				elem.draggable = false
			}, 1);
		})
	}, [])

	// inputPadding => addTodo
	React.useEffect(() => {
		const inputPadding = document.querySelector('.add-todo__task') && document.querySelector('.add-todo__task').clientWidth + 5 + "px"
		document.querySelector('.input__text') && (document.querySelector('.input__text').style.paddingLeft = inputPadding)
	}, [taskForAddTodo, []])



	// ! RETURN
	return (
		<Context.Provider value={{ todos, setTodos, draggable, setDraggable, mobile, tasks, setTasks, lang, setLang, setPopUpState, setShowPopUp, taskForAddTodo, setTaskForAddTodo, inputOfAddTodo, setInputOfAddTodo, yearForAddTodo, action, moveTodo, moveTask, toggleAction, showDate, setShowDate, showTask, setShowTask, showSection, setShowSection }}>

			<Burger />
			{showSection.addTodo && <AddTodo addTodo={addTodo} />}

			{showSection.week &&
				<>
					<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
					{daysHtmlElements}
					<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
				</>
			}

			{showPopUp && <PopUp {...popUpState} />}

			<SearchIcon />
			{!showSection.week && !showSection.addTodo && <Search />}

			<Scroll />
		</Context.Provider>
	)
}
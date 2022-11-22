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
import year from "./year"
import SearchIcon from "./components/SearchIcon"


export default function App() {

	const t = translate()

	// ! lang
	const [lang, setLang] = React.useState(defineLang()) // UK, EN ...
	React.useEffect(() => {
		document.cookie = `lang="${lang}"`
		// rewrite dateTranslated on lang change
		const date = getCookie("dateForAddTodo") // Nov 17
		const dateInd = year.EN.indexOf(date) // 320
		const dateTranslated = year[lang][dateInd] // Лист 17
		document.cookie = `dateTranslated=${dateTranslated}`
	}, [lang])
	// ? lang

	// ! default cookies => on first load
	if (!document.cookie.match(/lang=/)) {
		document.cookie = `lang="${defineLocation()}"`
		// todo, mandatory
		// window.location.reload()
	}
	if (!document.cookie.match(/colors/)) {
		document.cookie = `colors={"work":"#7ec5fb","buy":"#ff8585","cook":"#aeffa3"};`
	}
	if (!document.cookie.match(/tasks=\[.+?]/)) {
		const date = new Date()
		const month = date.toLocaleString(lang, { month: 'long' }).toLowerCase()
		document.cookie = `tasks=[{work: "#aeffa3"},{ideas: "#7ec5fb"}, {${month}: "#ff8585"}]`
	}
	if (!document.cookie.match(/lastTodo/)) {
		document.cookie = `lastTodo="3"`
	}
	if (!document.cookie.match(/dateForAddTodo/)) {
		document.cookie = `dateForAddTodo=${getToday()}`
	}
	if (localStorage.length === 0) {
		// create FAKE todos on start for DRAG & DROP to status title
		localStorage.setItem(0, JSON.stringify({ id: 0, doing: false, done: false, canceled: false, year: new Date().getFullYear() }))
		localStorage.setItem(1, JSON.stringify({ id: 1, doing: true, done: false, canceled: false, year: new Date().getFullYear() }))
		localStorage.setItem(2, JSON.stringify({ id: 2, doing: false, done: true, canceled: false, year: new Date().getFullYear() }))
		localStorage.setItem(3, JSON.stringify({ id: 3, doing: false, done: false, canceled: true, year: new Date().getFullYear() }))
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

	// show change lang popup ONLY at very first load
	const [x1, x1Set] = React.useState(1)
	if (!document.cookie.match(/langPopUp/) && x1 === 1) {
		makePopUp({ title: t[30], setPopUpState, setShowPopUp, modalWindowType: "select" })
		x1Set(2)
	}

	const daysHtmlElements = weeks.EN[weekNum].map((day, ind) => <OneDayTodos action={action} date={day} dateTranslated={weeks[lang][weekNum][ind]} moveTodo={moveTodo} moveTask={moveTask} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} toggleAction={toggleAction} />)

	// ! addTodo
	function addTodo() {
		let lastTodo
		lastTodo = document.cookie.match(/lastTodo="\d+/) && document.cookie.match(/lastTodo="\d+/)[0].replace(/lastTodo="/, '') * 1
		// ! date
		const date = getCookie("dateForAddTodo")
		// ? date
		let textWithoutTask = inputOfAddTodo
		taskForAddTodo && (textWithoutTask = textWithoutTask.replace(taskForAddTodo, ''))
		const text = textWithoutTask || `Test Task ${lastTodo - 3 + 1}`
		lastTodo++

		setTodos(prevState => {
			return [...prevState, { task: taskForAddTodo, id: lastTodo, date: date, year: yearForAddTodo, text: text, doing: false, done: false, canceled: false, showAction: false }]
		})

		document.cookie = `lastTodo="${lastTodo}"`
		// ! PopUp
		const dateTranslated = getCookie("dateTranslated")
		setLastTodoId(lastTodo) // for makePopUp
		makePopUp({ imgName: "add", title: dateTranslated, text: text, setPopUpState, setShowPopUp })
	}
	// ! action: propName: done/doing/canceled,etc... works only with BOOLS!
	function action(todoId, propName, propNameTranslated) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoId ? { ...elem, doing: false, done: false, canceled: false, [propName]: !elem[propName] } : elem
			})
		})
		// localStorage
		const curTodoStr = localStorage.getItem(todoId)
		const curTodoObj = JSON.parse(curTodoStr)
		curTodoObj[propName] = !curTodoObj[propName]
		// todo remove localStorage.setItem
		// localStorage.setItem(todoId, JSON.stringify(curTodoObj))
		// ! PopUp
		setLastTodoId(todoId) // for makePopUp
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
		const date = newDate.match(/\w+\s\d+/)[0]
		const year = newDate.match(/\d{4}/)[0]
		// state
		setTodos(prevState => prevState.map(todo => {
			return todo.id === todoId ? { ...todo, date: date, year: year } : todo
		}))
		// PopUp
		setLastTodoId(todoId) // for makePopUp
		makePopUp({ imgName: "add", title: newDateTranslated, text: todos[todoId].text, setPopUpState, setShowPopUp })
	}
	// ! moveTask
	function moveTask(todoId, newTask) {
		// state
		setTodos(prevState => prevState.map(elem => {
			return elem.id === todoId ? { ...elem, task: newTask } : elem
		}))
		// PopUp
		setLastTodoId(todoId) // for makePopUp
		makePopUp({ imgName: "add", text: todos[todoId].text, setPopUpState, setShowPopUp })
	}
	// todo
	// React.useEffect(() => {
	// 	// style chosen-day set in cookie "dateForAddTodo"
	// 	const dateChosen = getCookie("dateForAddTodo")
	// 	document.querySelector(`.${dateChosen}`).classList.add('chosen-day')
	// }, [])

	// ! year & changeWeek
	// null the year to current, once at reload
	x1 === 1 && (document.cookie = `yearForAddTodo=${new Date().getFullYear()}`)

	const cookieYear = Number(document.cookie.match(/yearForAddTodo=\d+/)[0].replace(/yearForAddTodo=/, ''))
	// todo name it year and yearArr (for cur year)
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
		document.cookie = `yearForAddTodo=${yearForAddTodo}`
	}, [yearForAddTodo])
	// ? year & changeWeek

	function popUpHide() {
		setShowPopUp(false)
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

	React.useEffect(() => {
		document.cookie = `tasks=${JSON.stringify(tasks)}`
	}, [tasks])

	const [taskForAddTodo, setTaskForAddTodo] = React.useState()
	const [inputOfAddTodo, setInputOfAddTodo] = React.useState()
	// ! showSection
	const [showSection, setShowSection] = React.useState({ addTodo: false, week: true, search: false })

	// ! lastTodoId
	const [lastTodoId, setLastTodoId] = React.useState()


	// ! return
	return (
		<Context.Provider value={{ todos, setTodos, draggable, setDraggable, mobile, tasks, setTasks, lang, setLang, setPopUpState, setShowPopUp, setTaskForAddTodo, inputOfAddTodo, setInputOfAddTodo, yearForAddTodo, action, moveTodo, moveTask, toggleAction, lastTodoId, setLastTodoId }}>

			<Burger showSection={showSection} setShowSection={setShowSection} />
			{showSection.addTodo && <AddTodo addTodo={addTodo} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />}

			{showSection.week &&
				<>
					<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
					{daysHtmlElements}
					<ChangeWeek changeWeek={changeWeek} weekNum={weekNum} />
				</>
			}

			{showPopUp && <PopUp {...popUpState} popUpHide={popUpHide} setTodos={setTodos} />}

			<SearchIcon showSection={showSection} setShowSection={setShowSection} />
			{!showSection.week && !showSection.addTodo && <Search showSection={showSection} setShowSection={setShowSection} action={action} moveTodo={moveTodo} moveTask={moveTask} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} toggleAction={toggleAction} />}

			<Scroll />
		</Context.Provider>
	)
}
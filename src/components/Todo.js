import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import cancel from "./../img/cancel.svg"
import canceled from "./../img/canceled.svg"
import dots from "./../img/dots.svg"
import dots2 from "./../img/dots2.svg"
import edit from "./../img/edit.svg"
import dlt from "./../img/dlt.svg"
import dnd from "./../img/dnd.svg"
import makePopUp from "../functions/makePopUp"
import translate from "../functions/Translate"
import { Context } from "./../context"
import MoveDateOptions from "./MoveDateOptions"
import Checkbox from "./Checkbox"
import setCookie from "../functions/setCookie"
import dateTranslate from "../functions/dateTranslate"


export default function Todo(props) {

	const t = translate()

	const { todos, setTodos, lang, setShowPopUp, showSection } = React.useContext(Context)

	const likedOrNot = props.doing ? liked : like
	const canceledOrNot = props.canceled ? canceled : cancel

	// ! color todo
	let color
	const { tasks } = React.useContext(Context)
	tasks.map(task => String(Object.keys(task)).trim().replace(/\s{2,}/g, ' ') == props.task && (color = Object.values(task)))

	const style = {
		background: color
	}
	// ? color todo in task color
	// ! editPopUp
	function editPopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp({ title: t[20] + " ", text: props.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "prompt", doFunction: "editTodo", todoId: props.id })
	}
	// ! delete todo
	function deleteTodo() {
		makePopUp({ title: t[21] + "?", text: props.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTodo", todoId: props.id })
	}
	// ! moveDate
	const [moveDateSelectState, setMoveDateSelectState] = React.useState(props.date + ", " + props.year)
	// refresh moveDateSelectState on dnd
	React.useEffect(() => {
		setMoveDateSelectState(props.date + ", " + props.year)
	}, [todos])

	function changeDate(event) {
		const { value } = event.target // Nov 20, 2022
		const date = value.match(/\w+\s\d+/)[0] // Nov 20
		const moveYear = ", " + value.match(/\d{4}/)[0] // 2023
		setMoveDateSelectState(value)
		const dateTranslated = dateTranslate(date, lang)
		props.moveTodo(props.id, value, dateTranslated + moveYear)
	}

	// ? moveDate
	// ! moveTask
	const [moveTaskSelectState, setMoveTaskSelectState] = React.useState(props.task)

	function changeTask(event) {
		const { value } = event.target
		setMoveTaskSelectState(value)
		props.moveTask(props.id, value)
	}

	let moveTaskOptions = tasks.map(task => <option>{String(Object.keys(task))}</option>)
	// refresh taskOptions in todo, when task changed in lastTodo
	React.useEffect(() => {
		setMoveTaskSelectState(props.task)
	}, [todos])

	// ! todo bg
	let bg
	props.doing && (bg = "doing-bg")
	props.done && (bg = "done-bg")
	props.canceled && (bg = "canceled-bg")
	!props.doing && !props.done && !props.canceled && (bg = "no-bg")

	// ! DRAG & DROP 
	const { draggable, setDraggable, mobile } = React.useContext(Context)
	// make all todo draggable on desktop; on mobile only .dnd icon is draggable
	!mobile && setDraggable(true)
	// ! dragStart
	let StartId
	function dragStart(event) {
		StartId = props.id // 1
		setCookie(`StartId=${StartId}`)
	}
	// ! dragOver
	let OverId
	let OverDate
	let OverYear
	function dragOver(event) {
		// todo writes cookie every milisecond
		event.preventDefault()
		OverId = props.id
		setCookie(`OverId=${OverId}`)
		setCookie(`OverDate=${props.date}`)
		setCookie(`OverYear=${props.year}`)
		// style todo over
		document.querySelectorAll('.todo').forEach(todo => todo.classList.remove('todo__over'))
		event.target.closest('.todo').classList.add('todo__over')
		// style day over
		document.querySelectorAll('.one-day-todos').forEach(todo => todo.classList.remove('one-day-todos__over'))
		event.target.closest('.one-day-todos').classList.add('one-day-todos__over')
		// style title over
		document.querySelectorAll('.todos-title').forEach(todo => todo.classList.remove('todos-title__over'))
		event.target.closest('.todos-title') && event.target.closest('.todos-title').classList.add('todos-title__over')
	}

	// ! dragEnd; !!! OverId 0-3 are for fake-todos
	function dragEnd(event) {
		OverId = Number(document.cookie.match(/OverId=\d+/)[0].replace(/OverId=/, '')) // e.g 5
		StartId = Number(document.cookie.match(/StartId=\d+/)[0].replace(/StartId=/, '')) // e.g 4

		OverDate = document.cookie.match(/OverDate=\S+\s\d+/)[0].replace(/OverDate=/, '') // Jan 2
		OverYear = document.cookie.match(/OverYear=\d+/)[0].replace(/OverYear=/, '') // 2023

		let startObj
		todos.map(todo => {
			return todo.id == StartId ? (startObj = todo) : todo
		})
		let overObj
		todos.map(todo => {
			return todo.id == OverId ? (overObj = todo) : todo
		})

		// ! status
		let newStatus, newStatusTranslated
		if (overObj.doing) { newStatus = 'doing'; newStatusTranslated = t[1] }
		if (overObj.done) { newStatus = 'done'; newStatusTranslated = t[2] }
		if (overObj.canceled) { newStatus = 'canceled'; newStatusTranslated = t[3] }

		// ! status is overwriten here; don't overwrite STATUS if in SEARCH
		let curSection
		Object.keys(showSection).map(s => showSection[s] && (curSection = s))
		if (curSection !== "search" && StartId > 3) {
			startObj.doing = false
			startObj.done = false
			startObj.canceled = false
			startObj[newStatus] = true
		}

		// ! WARNING now newStatus = dnd (for using img "add"), NOT (doing,done,canceled)
		if (newStatus === undefined) { newStatus = 'add'; newStatusTranslated = t[0] }
		// ? status

		// if date NOT changing => show popup with new status
		if (startObj.date === OverDate && curSection !== "search") {
			// don't show PopUp if this same todo
			if (startObj === overObj) {
				return
			}
			// in this case todo steals id from other todo, so correct task is from overObj
			OverId > 3 && makePopUp({ todoId: overObj.id, imgName: newStatus, title: newStatusTranslated, text: startObj.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp })
			// in this case todo DON'T steal id from other todo, so correct task is from startObj
			OverId <= 3 && makePopUp({ todoId: startObj.id, imgName: newStatus, title: newStatusTranslated, text: startObj.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp })
		}
		//  if date CHANGING => show popup with date1->date2
		if (startObj.date !== OverDate && curSection !== "search") {
			const dateTranslated1 = dateTranslate(startObj.date, lang)
			const dateTranslated2 = dateTranslate(OverDate, lang)
			// in this case todo steals id from other todo, so correct task is from overObj
			OverId > 3 && makePopUp({ todoId: overObj.id, imgName: newStatus, title: dateTranslated1 + "->" + dateTranslated2 + " - " + newStatusTranslated, text: startObj.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp })
			// in this case todo DON'T steal id from other todo, so correct task is from startObj
			OverId <= 3 && makePopUp({ todoId: startObj.id, imgName: newStatus, title: dateTranslated1 + "->" + dateTranslated2 + " - " + newStatusTranslated, text: startObj.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp })
		}
		if (curSection === "search") {
			setShowPopUp(false)
		}
		// ! date & year is overwriten here; don't overwrite DATE & YEAR if in SEARCH
		OverDate != "undefined" && curSection !== "search" && (startObj.date = OverDate)
		OverYear != "undefined" && curSection !== "search" && (startObj.year = OverYear)
		// DONT steal info(id,status, etc...) from fake-todos, correct STATUS is overwritten above
		// fake-todos have id 0-3
		if (OverId <= 3) {
			setTodos(prevState => prevState.map(todo => {
				return todo.id === StartId ? { ...startObj, id: StartId } : todo
			}))
		} else {
			// steal id from todo, startObj (dragStart) steals id from overObj (dragEnd)
			// ! setTodos
			setTodos(prevState => prevState.map(todo => {
				return todo.id === StartId ? { ...todo, id: -1 } : todo // id 1 (StartId) = id -1 (temp id)
			}))

			setTodos(prevState => prevState.map(todo => {
				return todo.id === OverId ? { ...startObj, id: OverId } : todo // id 2 = id 1 (OverId = StartId)
			}))

			setTodos(prevState => prevState.map(todo => {
				return todo.id === -1 ? { ...overObj, id: StartId } : todo // id 1 = id 2 (StartId = OverId)
			}))
		}
	}
	// ? DRAG & DROP 

	const taskName = (props.task === undefined || props.task === "undefined") ? t[19] : props.task

	// ! return
	return (
		<div className={`todo ${props.cssClass}`} style={style} draggable={draggable} onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragEnd}>
			<Checkbox done={props.done} action={props.action} id={props.id} />
			<p className="todo__info">
				{props.showDate && <span className="todo__date">{props.dateTranslated}</span>}
				{(props.showDate && props.showTask) && <br />}
				{props.showTask && <span className="todo__task">{taskName || t[19]}</span>}
				{(props.showDate || props.showTask) && <br />}
				<span className="todo__text">{props.text}</span>
			</p>

			{props.showAction &&
				<div className="actions">

					<select
						name="moveDate"
						value={moveDateSelectState}
						onChange={changeDate}
					>
						<MoveDateOptions />
					</select>

					<img className="like" src={likedOrNot} onClick={() =>
						props.action(props.id, "doing", t[1])
					} />

					<img className="hide" src={canceledOrNot} onClick={() =>
						props.action(props.id, "canceled", t[3])
					} />

					<img className="edit" src={edit} onClick={editPopUp} />

					<img className="del" src={dlt} onClick={deleteTodo} />

					<select
						name="moveTask"
						value={moveTaskSelectState}
						onChange={changeTask}
					>
						<option value="undefined">{t[19]}</option>
						{moveTaskOptions.reverse()}
					</select>

				</div>
			}

			{(props.cssClass != "fake-todo" && mobile) && <img className="dnd" src={dnd} onTouchStart={() => setDraggable(true)} onTouchEnd={() => setDraggable(false)} />}

			<img className="dots" src={props.showAction ? dots2 : dots} onClick={() => props.toggleAction(props.id)} />

			<span className={`todo__bg ${bg}`}></span>

		</div>
	)
}
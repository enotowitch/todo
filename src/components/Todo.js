import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import cancel from "./../img/cancel.svg"
import canceled from "./../img/canceled.svg"
import dots from "./../img/dots.svg"
import dots2 from "./../img/dots2.svg"
import edit from "./../img/edit.svg"
import del from "./../img/del.svg"
import dnd from "./../img/dnd.svg"
import makePopUp from "../functions/makePopUp"
import translate from "../functions/translate"
import { Context } from "./../context"
import MoveDateOptions from "./MoveDateOptions"
import year from "./../year"
import defineLang from "../functions/defineLang"

const t = translate()
const lang = defineLang()

export default function Todo(props) {

	const { todos } = React.useContext(Context)
	const { setTodos } = React.useContext(Context)

	const likedOrNot = props.doing ? liked : like
	const canceledOrNot = props.canceled ? canceled : cancel
	const checkbox = props.done ? <input type="checkbox" checked onChange={() => props.action(props.id, "done", t[2])} /> :
		<input type="checkbox" onChange={() => props.action(props.id, "done", t[2])} />

	// ! color todo
	let color
	let text
	const { tasks } = React.useContext(Context)
	tasks.map(task => Object.keys(task) == props.task && (color = Object.values(task)))

	const style = {
		background: color
	}
	// ? color todo in task color
	// ! editPopUp
	function editPopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp({ title: t[20] + "...", text: props.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "prompt", doFunction: "editTodo", todoId: props.id })
	}
	// ! delete todo
	function deleteTodo() {
		makePopUp({ title: t[21] + "?", text: props.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTodo", todoId: props.id })
	}
	// ! moveDate
	const [moveDateSelectState, setMoveDateSelectState] = React.useState({ moveDate: props.date })

	function changeDate(event) {
		const { name, value } = event.target
		setMoveDateSelectState(prevState => ({ ...prevState, [name]: value }))
		const dateTranslated = year.EN.indexOf(value) // index 0-364, "use" year[UA][114]
		props.moveTodo(props.id, value, year[lang][dateTranslated])
	}

	// ? moveDate
	// ! moveTask
	const [moveTaskSelectState, setMoveTaskSelectState] = React.useState({ moveTask: props.task })

	function changeTask(event) {
		const { name, value } = event.target
		setMoveTaskSelectState(prevState => ({ ...prevState, [name]: value }))
		props.moveTask(props.id, value)
	}

	const moveTaskOptions = tasks.map(task => <option>{Object.keys(task)}</option>)

	// ! todo bg
	let bg
	props.doing && (bg = "doing-bg")
	props.done && (bg = "done-bg")
	props.canceled && (bg = "canceled-bg")
	!props.doing && !props.done && !props.canceled && (bg = "no-bg")

	// ! DRAG & DROP 
	const { draggable } = React.useContext(Context)
	const { setDraggable } = React.useContext(Context)
	const { mobile } = React.useContext(Context)
	// make all todo draggable on desktop; on mobile only .dnd icon is draggable
	!mobile && setDraggable(true)
	// prevent fake-todo from dragging
	React.useEffect(() => {
		document.querySelectorAll('.fake-todo').forEach((elem) => {
			elem.draggable = false
		})
	}, [])
	// ! dragStart
	let StartId
	function dragStart(event) {
		StartId = props.id // 1
		document.cookie = `StartId=${StartId}`
	}
	// ! dragOver
	let OverId
	let OverDate
	function dragOver(event) {
		event.preventDefault()
		OverId = props.id // 2
		document.cookie = `OverId=${OverId}`
		document.cookie = `OverDate=${props.date}`
	}

	// ! dragEnd
	function dragEnd(event) {
		OverId = Number(document.cookie.match(/OverId=\d+/)[0].replace(/OverId=/, ''))
		StartId = Number(document.cookie.match(/StartId=\d+/)[0].replace(/StartId=/, ''))

		OverDate = document.cookie.match(/OverDate=\w+/)[0].replace(/OverDate=/, '')

		let startObj
		todos.map(todo => {
			return todo.id == StartId ? (startObj = todo) : todo
		})
		let overObj
		todos.map(todo => {
			return todo.id == OverId ? (overObj = todo) : todo
		})

		let newStatus, newStatusTranslated
		if (overObj.doing) { newStatus = 'doing'; newStatusTranslated = t[1] }
		if (overObj.done) { newStatus = 'done'; newStatusTranslated = t[2] }
		if (overObj.canceled) { newStatus = 'canceled'; newStatusTranslated = t[3] }

		startObj.doing = false
		startObj.done = false
		startObj.canceled = false
		startObj[newStatus] = true

		// ! WARNING now newStatus = add (for using img "add"), NOT (doing,done,canceled)
		if (newStatus === undefined) { newStatus = 'add'; newStatusTranslated = t[0] }

		// if date NOT changing => show popup with new status; else show popup with new date+status => (true = this day, false = other day)
		if (startObj.date === OverDate) {
			makePopUp({ imgName: newStatus, title: newStatusTranslated, text: startObj.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp })
		} else {
			const dateTranslated = year.EN.indexOf(OverDate) // index 0-364, "use" year[UA][114]
			makePopUp({ imgName: newStatus, title: year[lang][dateTranslated], text: startObj.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp })
		}
		// ! date is overwriten here; don't overwrite DATE if in SEARCH
		OverDate != "undefined" && props.section !== "search" && (startObj.date = OverDate)
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


	// ! return
	return (
		<div className={`todo ${props.cssClass}`} style={style} draggable={draggable} onDragStart={dragStart} onDragOver={dragOver} onDragEnd={dragEnd}>
			{checkbox}
			{props.showDate && <p className="todo__date">{props.dateTranslated}</p>}
			<p className="todo__text">{text || props.text}</p>

			{props.showAction &&
				<div className="actions">

					<select
						name="moveDate"
						value={moveDateSelectState.moveDate}
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

					<img className="del" src={del} onClick={deleteTodo} />

					<select
						name="moveTask"
						value={moveTaskSelectState.moveTask}
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
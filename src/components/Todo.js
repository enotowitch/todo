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
import year from "./../year"
import translate from '../functions/translate'
import { Context } from "./../context"

const t = translate()

export default function Todo(props) {

	const { todos } = React.useContext(Context)
	const { setTodos } = React.useContext(Context)
	const { draggable } = React.useContext(Context)
	const { setDraggable } = React.useContext(Context)

	const likedOrNot = props.doing ? liked : like
	const canceledOrNot = props.canceled ? canceled : cancel
	const checkbox = props.done ? <input type="checkbox" checked onChange={() => props.action(props.id, "done", t[2])} /> :
		<input type="checkbox" onChange={() => props.action(props.id, "done", t[2])} />

	// ! color
	let color
	let text
	const colorsObj = JSON.parse(document.cookie.match(/colors={.*?}/)[0].replace(/colors=/, ''))
	// todo HAS DUP
	const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace(/tasks=/, ''))

	const tasksArr = []
	Object.values(tasksObj).map(elem => tasksArr.push(elem)) // ['taskName1', 'taskName2', 'taskName3']



	tasksArr.map(taskName => { // - taskName1,taskName2 ...
		if (props.task === taskName.trim()) { // if task exists => color, remove taskName
			color = colorsObj[taskName]
		}
	})

	const style = {
		background: color
	}
	// ? color
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
		props.moveTodo(props.id, value)
	}

	const moveDateOptions = year.map(elem => <option>{elem}</option>)
	// ? moveDate
	// ! moveTask
	const [moveTaskSelectState, setMoveTaskSelectState] = React.useState({ moveTask: props.task })

	function changeTask(event) {
		const { name, value } = event.target
		setMoveTaskSelectState(prevState => ({ ...prevState, [name]: value }))
		props.moveTask(props.id, value)
	}

	const moveTaskOptions = tasksArr.reverse().map(taskName => <option>{taskName}</option>)

	// ! todo bg
	let bg
	props.doing && (bg = "doing-bg")
	props.done && (bg = "done-bg")
	props.canceled && (bg = "canceled-bg")
	!props.doing && !props.done && !props.canceled && (bg = "no-bg")

	// ! DRAG & DROP 
	// ! dragStart
	let StartId
	function dragStart(event) {
		StartId = props.id // 1
		document.cookie = `StartId=${StartId}`
	}
	// ! dragOver
	let OverId
	function dragOver(event) {
		event.preventDefault()
		OverId = props.id // 2
		document.cookie = `OverId=${OverId}`
	}

	// ! dragEnd
	function dragEnd(event) {
		OverId = Number(document.cookie.match(/OverId=\d+/)[0].replace(/OverId=/, ''))
		StartId = Number(document.cookie.match(/StartId=\d+/)[0].replace(/StartId=/, ''))

		let startObj
		todos.map(todo => {
			return todo.id == StartId ? (startObj = todo) : todo
		})
		let overObj
		todos.map(todo => {
			return todo.id == OverId ? (overObj = todo) : todo
		})

		let newStatus
		overObj.doing && (newStatus = 'doing')
		overObj.done && (newStatus = 'done')
		overObj.canceled && (newStatus = 'canceled')

		startObj.doing = false
		startObj.done = false
		startObj.canceled = false
		startObj[newStatus] = true

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
			{props.showDate && <p className="todo__date">{props.date}</p>}
			<p className="todo__text">{text || props.text}</p>

			{props.showAction &&
				<div className="actions">

					<select
						name="moveDate"
						value={moveDateSelectState.moveDate}
						onChange={changeDate}
					>
						{moveDateOptions}
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
						{moveTaskOptions}
					</select>

				</div>
			}

			{props.cssClass != "fake-todo" && <img className="dnd" src={dnd} onTouchStart={() => setDraggable(true)} onTouchEnd={() => setDraggable(false)} />}

			<img className="dots" src={props.showAction ? dots2 : dots} onClick={() => props.toggleAction(props.id)} />

			<span className={`todo__bg ${bg}`}></span>

		</div>
	)
}
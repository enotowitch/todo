import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import cancel from "./../img/cancel.svg"
import canceled from "./../img/canceled.svg"
import dots from "./../img/dots.svg"
import dots2 from "./../img/dots2.svg"
import edit from "./../img/edit.svg"
import del from "./../img/del.svg"
import makePopUp from "../functions/makePopUp"
import year from "./../year"

export default function Todo(props) {

	const likedOrNot = props.doing ? liked : like
	const canceledOrNot = props.canceled ? canceled : cancel
	const checkbox = props.done ? <input type="checkbox" checked onChange={() => props.action(props.id, "done")} /> :
		<input type="checkbox" onChange={() => props.action(props.id, "done")} />

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
			text = props.text.replace(taskName, '') // text without taskName
		}
	})

	const style = {
		background: color
	}
	// ? color
	// ! editPopUp
	function editPopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp({ title: "Editing...", text: props.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "prompt", doFunction: "editTodo", todoId: props.id })
	}
	// ! delete todo
	function deleteTodo() {
		makePopUp({ title: "Delete?", text: props.text, setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTodo", todoId: props.id })
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

	return (
		<div className="todo" style={style}>
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
						props.action(props.id, "doing")
					} />

					<img className="hide" src={canceledOrNot} onClick={() =>
						props.action(props.id, "canceled")
					} />

					<img className="edit" src={edit} onClick={editPopUp} />

					<img className="del" src={del} onClick={deleteTodo} />

					<select
						name="moveTask"
						value={moveTaskSelectState.moveTask}
						onChange={changeTask}
					>
						<option value="undefined">No Task</option>
						{moveTaskOptions}
					</select>

				</div>
			}

			<img className="dots" src={props.showAction ? dots2 : dots} onClick={() => props.toggleAction(props.id)} />

			<span className={`todo__bg ${bg}`}></span>

		</div>
	)
}
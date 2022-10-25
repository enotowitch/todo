import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import hide from "./../img/hide.svg"
import dots from "./../img/dots.svg"
import edit from "./../img/edit.svg"
import del from "./../img/del.svg"
import makePopUp from "../functions/makePopUp"
import year from "./../year"

export default function Todo(props) {

	const likedOrNot = props.isLiked ? liked : like
	const checkbox = props.isDone ? <input type="checkbox" checked onChange={() => props.action(props.id, 'isDone')} /> :
		<input type="checkbox" onChange={() => props.action(props.id, 'isDone')} />

	// ! color
	let color
	let text
	const colorsObj = JSON.parse(document.cookie.match(/colors={.*?}/)[0].replace(/colors=/, ''))
	const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace(/tasks=/, ''))

	const tasksArr = []
	Object.values(tasksObj).map(elem => tasksArr.push(elem)) // ['taskName1', 'taskName2', 'taskName3']

	tasksArr.map(taskName => { // - taskName1,taskName2 ...
		// todo only works with one word 
		const firstWord = props.text.match(/[a-zA-Zа-яА-Я0-9]*/)[0].trim()
		if (firstWord.match(taskName.trim())) { // if in props.text taskName from tasksObj (cookie)
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
		makePopUp("", "Editing...", props.text, props.setPopUpState, props.setShowPopUp, "prompt")
	}
	// ! delete todo
	function delTodo() {
		makePopUp("", "Delete?", props.text, props.setPopUpState, props.setShowPopUp, "confirm")
		localStorage.removeItem(props.id)
	}
	const [moveSelectState, setMoveSelectState] = React.useState({ moveDate: props.date })

	function changeMoveSelect(event) {
		const { name, value } = event.target
		setMoveSelectState(prevState => ({ ...prevState, [name]: value }))
		props.moveTodo(props.id, value)
	}

	const options = year.map(elem => <option>{elem}</option>)

	return (
		<div className="todo" style={style}>
			{checkbox}
			{props.showDate && <p className="todo__date">{props.date}</p>}
			<p className="todo__text">{text || props.text}</p>

			{props.showAction &&
				<div className="actions">

					<img className="edit" src={edit} onClick={editPopUp} />

					<img className="like" src={likedOrNot} onClick={() =>
						props.action(props.id, 'isLiked')
					} />

					<img className="hide" src={hide} onClick={() =>
						props.action(props.id, 'isHidden')
					} />

					<select
						name="moveDate"
						value={moveSelectState.moveDate}
						onChange={changeMoveSelect}
					>
						{options}
					</select>

					<img className="del" src={del} onClick={delTodo} />
				</div>
			}

			<img className="dots" src={dots} onClick={() => props.toggleAction(props.id)} />
		</div>
	)
}
import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import hide from "./../img/hide.svg"
import move from "./../img/move.svg"
import dots from "./../img/dots.svg"
import edit from "./../img/edit.svg"
import del from "./../img/del.svg"
import makePopUp from "../functions/makePopUp"

export default function Todo(props) {

	const likedOrNot = props.isLiked ? liked : like
	const checkbox = props.isDone ? <input type="checkbox" checked onChange={() => props.action(props.id, 'isDone')} /> :
		<input type="checkbox" onChange={() => props.action(props.id, 'isDone')} />

	// ! showActions
	const [showActions, setShowActions] = React.useState(false)
	function toggleActions() {
		setShowActions(prevState => !prevState)
	}

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
	// ! togglePopUp
	function togglePopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp("", "Editing...", props.text, props.setPopUpState, props.setShowPopUp, "prompt")
	}
	// ! delete todo
	function delTodo() {
		makePopUp("", "Delete?", props.text, props.setPopUpState, props.setShowPopUp, "confirm")
		localStorage.removeItem(props.id)
	}


	return (
		<div className="todo" style={style}>
			{checkbox}
			<p className="todo__text">{text || props.text}</p>

			{showActions &&
				<div className="actions">

					<img className="edit" src={edit} onClick={togglePopUp} />

					<img className="like" src={likedOrNot} onClick={() =>
						props.action(props.id, 'isLiked')
					} />

					<img className="hide" src={hide} onClick={() =>
						props.action(props.id, 'isHidden')
					} />

					<img className="move-down" src={move} onClick={() =>
						props.moveTodo(props.id, "down")
					} />

					<img className="move-up" src={move} onClick={() =>
						props.moveTodo(props.id, "up")
					} />

					<img className="del" src={del} onClick={delTodo} />
				</div>
			}

			<img className="dots" src={dots} onClick={toggleActions} />
		</div>
	)
}
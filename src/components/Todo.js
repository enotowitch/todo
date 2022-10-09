import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import hide from "./../img/hide.svg"
import move from "./../img/move.svg"
import dots from "./../img/dots.svg"

export default function Todo(props) {

	const likedOrNot = props.isLiked ? liked : like
	const checkbox = props.isDone ? <input type="checkbox" checked onChange={() => props.action(props.id, 'isDone')} /> :
		<input type="checkbox" onChange={() => props.action(props.id, 'isDone')} />

	function toggleActionImgsView(event) {
		document.querySelectorAll('.todo img').forEach(elem => elem.className != "dots" && elem.classList.add('dn'))
		event.target.closest('.todo').querySelectorAll('img').forEach(elem => elem.className != "dots" && elem.classList.toggle('dn'))
	}


	return (
		<div className="todo">
			{checkbox}
			<p className="todo__text">{props.text}</p>

			<img className="like dn" src={likedOrNot} onClick={() =>
				props.action(props.id, 'isLiked')
			} />

			<img className="hide dn" src={hide} onClick={() =>
				props.action(props.id, 'isHidden')
			} />

			<img className="move-down dn" src={move} onClick={() =>
				props.moveTodo(props.id, "down")
			} />

			<img className="move-up dn" src={move} onClick={() =>
				props.moveTodo(props.id, "up")
			} />

			<img className="dots" src={dots} onClick={toggleActionImgsView} />
		</div>
	)
}
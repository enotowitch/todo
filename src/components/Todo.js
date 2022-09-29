import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import hide from "./../img/hide.svg"

export default function Todo(props) {

	const likedOrNot = props.isLiked ? liked : like
	const checkbox = props.isDone ? <input type="checkbox" checked onChange={() => props.handleAction(props.id, 'isDone')} /> :
		<input type="checkbox" onChange={() => props.handleAction(props.id, 'isDone')} />

	// ! show only not hidden todos
	if (!props.isHidden)

		return (
			<div className="todo">
				{checkbox}
				<p>{props.text}</p>

				<img className="like" src={likedOrNot} onClick={() =>
					props.handleAction(props.id, 'isLiked')
				} />

				<img className="hide" src={hide} onClick={() =>
					props.handleAction(props.id, 'isHidden')
				} />
			</div>
		)
}
import React from "react"
import like from "./../img/like.svg"
import liked from "./../img/liked.svg"
import hide from "./../img/hide.svg"

export default function Todo(props) {

	const likedOrNot = props.isLiked ? liked : like
	const checkbox = props.isDone ? <input type="checkbox" checked onChange={() => props.handleDone(props.id)} /> :
		<input type="checkbox" onChange={() => props.handleDone(props.id)} />

	// ! show only not hidden todos
	if (!props.isHidden)

		return (
			<div className="todo">
				{checkbox}
				<p>{props.text}</p>

				<img className="like" src={likedOrNot} onClick={() =>
					props.handleLike(props.id)
				} />

				<img className="hide" src={hide} onClick={() =>
					props.handleHide(props.id)
				} />
			</div>
		)
}
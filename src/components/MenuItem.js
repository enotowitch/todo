import React from "react"
import arrow from "./../img/arrow.svg"

export default function MenuItem(props) {
	return (
		<>
			<div className="menu__title" onClick={() => props.toggleMenuContent(props.id)}>
				<span>{props.title}</span>
				<img className="arrow" src={arrow} />
			</div>

			{props.isShown &&
				<div className="menu__content">{props.content}</div>
			}
		</>
	)
}
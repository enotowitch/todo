import React from "react"

export default function Burger(props) {
	return (
		<>
			<input id="burger__toggle" type="checkbox" onClick={props.toggleAddTodo} />
			<label className="burger__btn" htmlFor="burger__toggle">
				<span></span>
			</label>
			<div className="top-icons-bg"></div>
		</>
	)
}
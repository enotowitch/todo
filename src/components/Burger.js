import React from "react"

export default function Burger(props) {
	return (
		<>
			<input id="burger__toggle" type="checkbox" onClick={props.toggleShowAddTodo} />
			<label className="burger__btn" htmlFor="burger__toggle">
				<span></span>
			</label>
		</>
	)
}
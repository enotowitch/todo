import React from "react"

export default function Menu(props) {
	return (
		<>
			<input id="menu__toggle" type="checkbox" onClick={props.toggleShowAddTodo} />
			<label className="menu__btn" htmlFor="menu__toggle">
				<span></span>
			</label>
		</>
	)
}
import React from "react"

export default function Burger(props) {

	function toggleAddTodo() {
		const checked = document.querySelector('#burger__toggle').checked
		if (checked) {
			props.setShowSection({ addTodo: true, week: false, search: false })
		} else {
			props.setShowSection({ addTodo: false, week: true, search: false })
		}
	}

	return (
		<>
			<input id="burger__toggle" type="checkbox" onClick={toggleAddTodo} />
			<label className="burger__btn" htmlFor="burger__toggle">
				<span></span>
			</label>
			<div className="top-icons-bg"></div>
		</>
	)
}
import React from "react"
import { Context } from "../context"

export default function Burger() {

	const { setShowSection } = React.useContext(Context)

	function toggleAddTodo() {
		const checked = document.querySelector('#burger__toggle').checked
		if (checked) {
			setShowSection({ addTodo: true, week: false, search: false })
		} else {
			setShowSection({ addTodo: false, week: true, search: false })
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
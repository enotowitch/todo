import React from "react"

export default function Settings() {

	function clearAllTodos() {
		localStorage.clear()
		window.location.reload()
	}

	return (
		<div className="add-todo__buttons">
			<button onClick={clearAllTodos}>clear all todos</button>
		</div>
	)
}
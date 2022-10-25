import React from "react"

export default function Settings(props) {

	function clearAllTodos() {
		localStorage.clear()
		window.location.reload()
	}

	return (
		<div className="add-todo__buttons">
			<button onClick={clearAllTodos}>delete all todos</button>
			<button onClick={props.delTasksPopUp}>clear all tasks</button>
		</div>
	)
}
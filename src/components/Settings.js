import React from "react"

export default function Settings(props) {

	return (
		<div className="add-todo__buttons">
			<button className="danger-button" onClick={props.deleteTodosPopUp}>delete all todos</button>
			<button className="danger-button" onClick={props.deleteTasksPopUp}>clear all tasks</button>
		</div>
	)
}
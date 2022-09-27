import React from "react"

export default function AddTodo(props) {

	function getText() {
		return document.querySelector('.input__text').value
	}
	function clearText() {
		document.querySelector('.input__text').value = ""
	}
	function clearAllTodos() {
		localStorage.clear()
		window.location.reload()
	}

	return (
		<>
			<input className="input__text" type="text" placeholder="add todo" />

			<button onClick={() =>
				props.handleClick(getText(),
					clearText())
			}>add</button>

			<button onClick={() =>
				clearAllTodos()
			}>clear all todos</button>
		</>
	)
}
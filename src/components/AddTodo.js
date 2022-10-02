import React from "react"

export default function AddTodo(props) {

	const [text, setText] = React.useState("")



	function getText(event) {
		setText(event.target.value)
	}
	function clearText() {
		setText("")
	}
	function clearAllTodos() {
		localStorage.clear()
		window.location.reload()
	}
	function test() {
		localStorage.setItem(localStorage.length + 1, JSON.stringify({ id: localStorage.length + 1, text: `Test Task ${localStorage.length + 1}`, isLiked: false, isDone: false, isHidden: false }))
		window.location.reload()
	}

	return (
		<div className="add-todo">
			<input
				className="input__text"
				type="text"
				placeholder="ADD 1 todo or ADD MANY: todo1, todo2, todo3..."
				value={text}
				onChange={getText} />

			<button onClick={() =>
				props.handleClick(text,
					clearText())
			}>add</button>

			<button onClick={() =>
				props.handleClick(text, "many",
					clearText())
			}>add many</button>

			<button onClick={() =>
				clearAllTodos()
			}>clear all todos</button>

			<button onClick={() =>
				test()
			}>test</button>
		</div>
	)
}
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
	React.useEffect(() => {
		const headerHeight = document.querySelector('.add-todo').offsetHeight
		const marginDiv = document.createElement('div')
		marginDiv.style.marginBottom = headerHeight + 30 + "px"
		document.querySelector('.add-todo').after(marginDiv)
	}, [])

	return (
		<div className="add-todo">
			<input
				className="input__text"
				type="text"
				placeholder="ADD 1 todo or ADD MANY: todo1, todo2, todo3..."
				value={text}
				onChange={getText} />

			<button onClick={() =>
				props.addTodo(text,
					clearText())
			}>add</button>

			<button onClick={() =>
				props.addTodo(text, "many",
					clearText())
			}>add many</button>

			<button onClick={() =>
				clearAllTodos()
			}>clear all todos</button>

			<button onClick={() =>
				props.addTodo(`Test Task ${localStorage.length + 1}`)
			}>test</button>
		</div>
	)
}
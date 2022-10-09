import React from "react"
import AllActionNums from "./AllActionNums"

export default function AddTodo(props) {

	const [text, setText] = React.useState("")

	// todo HAS DUP
	let isLikedNum = 0
	props.todos.map(elem => elem.isLiked && isLikedNum++)
	let isHiddenNum = 0
	props.todos.map(elem => elem.isHidden && isHiddenNum++)
	let isDoneNum = 0
	props.todos.map(elem => elem.isDone && isDoneNum++)
	let allTodosNum = props.todos.length

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
				placeholder="ADD ONE: todo. or ADD MANY: todo1, todo2, ..."
				value={text}
				onChange={getText} />
			<div className="add-todo__buttons">
				<button onClick={() =>
					props.addTodo(text, "one",
						clearText())
				}>add one</button>

				<button onClick={() =>
					props.addTodo(text, "many",
						clearText())
				}>add many</button>

				{/* <button onClick={() =>
				clearAllTodos()
			}>clear all todos</button> */}

				{/* <button onClick={() =>
					props.addTodo(`Test Task ${localStorage.length + 1}`)
				}>test</button> */}
			</div>

			<div className="add-todo-nums">
				<AllActionNums nums={{ allTodosNum, isDoneNum, isLikedNum, isHiddenNum }} />
			</div>

		</div>
	)
}
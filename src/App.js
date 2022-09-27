import React from "react"
import AddTodo from "./components/AddTodo"
import Todo from "./components/Todo"

const arrOfObjects = []
Object.keys(localStorage).map(elem => arrOfObjects.push({ id: elem, text: localStorage.getItem(elem) }))

export default function App() {

	const [todos, setTodos] = React.useState(arrOfObjects)

	function addTodo(inputText) {
		setTodos(prevState => {
			return [...prevState, { id: prevState.length + 1, text: inputText }]
		})
		localStorage.setItem(todos.length + 1, inputText)
	}

	const todoElems = todos.map((elem, ind) => <Todo key={ind} text={elem.text} />)

	return (
		<>
			<AddTodo handleClick={addTodo} />
			{todoElems}
		</>
	)
}
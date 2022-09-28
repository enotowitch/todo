import React from "react"
import AddTodo from "./components/AddTodo"
import Todo from "./components/Todo"
import data from "./localStorageData"
import makeObj from "./functions/makeObj"

export default function App() {

	const [todos, setTodos] = React.useState(data)

	function addTodo(inputText) {
		setTodos(prevState => {
			return [...prevState, { id: prevState.length + 1, text: inputText, isLiked: false, isDone: false }]
		})
		localStorage.setItem(todos.length + 1, JSON.stringify({ id: todos.length + 1, text: inputText, isLiked: false, isDone: false }))
	}

	function like(todoID) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, isLiked: !elem.isLiked } : elem
			})
		})
		const curTodoStr = localStorage.getItem(todoID)
		const curTodoObj = makeObj(curTodoStr)
		curTodoObj.isLiked = !curTodoObj.isLiked
		localStorage.setItem(todoID, JSON.stringify(curTodoObj))
	}
	// todo get a name of the argument passed to the function and place to 'isLiked','isDone', etc...
	function done(todoID) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, isDone: !elem.isDone } : elem
			})
		})
		const curTodoStr = localStorage.getItem(todoID)
		const curTodoObj = makeObj(curTodoStr)
		curTodoObj.isDone = !curTodoObj.isDone
		localStorage.setItem(todoID, JSON.stringify(curTodoObj))
	}

	const todoElems = todos.map((elem, ind) => <Todo key={ind} {...elem} handleLike={like} handleDone={done} />)

	return (
		<>
			<AddTodo handleClick={addTodo} />
			{todoElems}
		</>
	)
}
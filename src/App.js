import React from "react"
import AddTodo from "./components/AddTodo"
import Todo from "./components/Todo"
import data from "./localStorageData"
import makeObj from "./functions/makeObj"

export default function App() {

	const [todos, setTodos] = React.useState(data)

	function addTodo(inputText) {
		setTodos(prevState => {
			return [...prevState, { id: prevState.length + 1, text: inputText, isLiked: false, isDone: false, isHidden: false }]
		})
		localStorage.setItem(todos.length + 1, JSON.stringify({ id: todos.length + 1, text: inputText, isLiked: false, isDone: false, isHidden: false }))
	}
	// ! like
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
	// ! done
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
	// ! hide
	function hide(todoID) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, isHidden: !elem.isHidden } : elem
			})
		})
		const curTodoStr = localStorage.getItem(todoID)
		const curTodoObj = makeObj(curTodoStr)
		curTodoObj.isHidden = !curTodoObj.isHidden
		localStorage.setItem(todoID, JSON.stringify(curTodoObj))
	}

	const todoElems = todos.map((elem, ind) => <Todo key={ind} {...elem} handleLike={like} handleDone={done} handleHide={hide} />)
	const hiddenTodos = todos.map((elem, ind) => {
		const newObj = { ...elem, isHidden: false }
		if (elem.isHidden) {
			return <Todo key={ind} {...newObj} handleLike={like} handleDone={done} handleHide={hide} />
		}
	})
	const likedTodos = todos.map((elem, ind) => {
		if (elem.isLiked) {
			return <Todo key={ind} {...elem} handleLike={like} handleDone={done} handleHide={hide} />
		}
	})
	const doneTodos = todos.map((elem, ind) => {
		if (elem.isDone) {
			return <Todo key={ind} {...elem} handleLike={like} handleDone={done} handleHide={hide} />
		}
	})
	function styleHiddenSection(e){
		e.target.nextSibling.classList.toggle('hidden-todos')
		e.target.classList.toggle('turned-on')
	}

	return (
		<>
			<AddTodo handleClick={addTodo} />

			<div className="all-todos-wrapper">

				{/* ! My Todos */}
				<div className="todos-wrapper">
					<p className="todos-title">My Todos</p>
					{todoElems}
				</div>

				{/* ! Done Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title" onClick={(e) =>
						styleHiddenSection(e)
					}>Show/Hide - Done Todos</p>
					<div className="hidden-todos">{doneTodos}</div>
				</div>

				{/* ! Liked Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title" onClick={(e) =>
						styleHiddenSection(e)
					}>Show/Hide - Liked Todos</p>
					<div className="hidden-todos">{likedTodos}</div>
				</div>

				{/* ! Hidden Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title" onClick={(e) =>
						styleHiddenSection(e)
					}>Show/Hide - Hidden Todos</p>
					<div className="hidden-todos">{hiddenTodos}</div>
				</div>
			</div>
		</>
	)
}
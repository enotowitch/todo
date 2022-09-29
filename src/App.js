import React from "react"
import AddTodo from "./components/AddTodo"
import Todo from "./components/Todo"
import data from "./localStorageData"

export default function App() {

	const [todos, setTodos] = React.useState(data)

	function addTodo(inputText) {
		setTodos(prevState => {
			return [...prevState, { id: prevState.length + 1, text: inputText, isLiked: false, isDone: false, isHidden: false }]
		})
		localStorage.setItem(todos.length + 1, JSON.stringify({ id: todos.length + 1, text: inputText, isLiked: false, isDone: false, isHidden: false }))
	}
	// ! action: propName: isDone/isLiked/isHidden,etc... works only with BOOLS!
	function action(todoID, propName) {
		setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === todoID ? { ...elem, [propName]: !elem[propName] } : elem
			})
		})
		// localStorage
		const curTodoStr = localStorage.getItem(todoID)
		const curTodoObj = JSON.parse(curTodoStr)
		curTodoObj[propName] = !curTodoObj[propName]
		localStorage.setItem(todoID, JSON.stringify(curTodoObj))
		// style .todos-title .propName
		document.querySelector(`[class*=${propName}]`).click()
		document.querySelector(`[class*=${propName}]`).classList.remove(propName)
	}

	const todoElems = todos.map((elem, ind) => <Todo key={ind} {...elem} handleAction={action} />)
	const hiddenTodos = todos.map((elem, ind) => {
		const newObj = { ...elem, isHidden: false }
		if (elem.isHidden) {
			return <Todo key={ind} {...newObj} handleAction={action} />
		}
	})
	const likedTodos = todos.map((elem, ind) => {
		if (elem.isLiked) {
			return <Todo key={ind} {...elem} handleAction={action} />
		}
	})
	const doneTodos = todos.map((elem, ind) => {
		if (elem.isDone) {
			return <Todo key={ind} {...elem} handleAction={action} />
		}
	})
	function styleHiddenSection(e) {
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
					<p className="todos-title isDone" onClick={(e) =>
						styleHiddenSection(e)
					}>Done Todos</p>
					<div className="hidden-todos">{doneTodos}</div>
				</div>

				{/* ! Liked Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title isLiked" onClick={(e) =>
						styleHiddenSection(e)
					}>Liked Todos</p>
					<div className="hidden-todos">{likedTodos}</div>
				</div>

				{/* ! Hidden Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title isHidden" onClick={(e) =>
						styleHiddenSection(e)
					}>Hidden Todos</p>
					<div className="hidden-todos">{hiddenTodos}</div>
				</div>
			</div>
		</>
	)
}
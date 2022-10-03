import React from "react"
import AddTodo from "./components/AddTodo"
import Todo from "./components/Todo"
import data from "./localStorageData"

export default function App() {

	const [todos, setTodos] = React.useState(data)

	let isLikedNum = 0
	todos.map(elem => elem.isLiked && isLikedNum++)
	let isHiddenNum = 0
	todos.map(elem => elem.isHidden && isHiddenNum++)
	let isDoneNum = 0
	todos.map(elem => elem.isDone && isDoneNum++)
	let allTodosNum = todos.length

	// ! intersections
	const isDoneIds = []
	todos.map(elem => elem.isDone && isDoneIds.push(elem.id))
	const isLikedIds = []
	todos.map(elem => elem.isLiked && isLikedIds.push(elem.id))
	const isHiddenIds = []
	todos.map(elem => elem.isHidden && isHiddenIds.push(elem.id))

	const isDoneAndisHiddenIntersection = isDoneIds.filter(elem => isHiddenIds.includes(elem))
	const isLikedAndisHiddenIntersection = isLikedIds.filter(elem => isHiddenIds.includes(elem))
	// ? intersections

	function addTodo(inputText, quantity) {
		// ! add MANY
		if (inputText.match(",") && quantity === "many") {
			const arr = inputText.split(",")
			for (let i = 0; i < arr.length; i++) {
				setTodos(prevState => {
					return [...prevState, { id: prevState.length + 1, text: arr[i], isLiked: false, isDone: false, isHidden: false }]
				})
				localStorage.setItem(todos.length + 1 + i, JSON.stringify({ id: todos.length + 1 + i, text: arr[i], isLiked: false, isDone: false, isHidden: false }))
			}
			return false
		}
		// ! add SINGLE
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
		const todosTitle = document.querySelector(`[class*=${propName}]`)
		todosTitle && !todosTitle.classList.contains('turned-on') ? todosTitle.click() : console.log('do nothing')
		todosTitle && todosTitle.classList.remove(propName)
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
					<p className="todos-title">My Todos
						<span className="todos-num">{allTodosNum - isHiddenNum}</span>
						{isHiddenNum > 0 && <span className="todos-num-hidden">{isHiddenNum}</span>}
					</p>
					{todoElems}
				</div>

				{/* ! Done Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title isDone" onClick={(e) =>
						styleHiddenSection(e)
					}>Done Todos
						<span className="todos-num">{isDoneNum}</span>
						{isDoneAndisHiddenIntersection.length > 0 && <span className="todos-num-hidden">{isDoneAndisHiddenIntersection.length}</span>}
					</p>
					<div className="hidden-todos">{doneTodos}</div>
				</div>

				{/* ! Liked Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title isLiked" onClick={(e) =>
						styleHiddenSection(e)
					}>Liked Todos
						<span className="todos-num">{isLikedNum}</span>
						{isLikedAndisHiddenIntersection.length > 0 && <span className="todos-num-hidden">{isLikedAndisHiddenIntersection.length}</span>}
					</p>
					<div className="hidden-todos">{likedTodos}</div>
				</div>

				{/* ! Hidden Todos */}
				<div className="hidden-todos-wrapper">
					<p className="todos-title isHidden" onClick={(e) =>
						styleHiddenSection(e)
					}>Hidden Todos
						<span className="todos-num">{isHiddenNum}</span>
					</p>
					<div className="hidden-todos">{hiddenTodos}</div>
				</div>
			</div>
		</>
	)
}
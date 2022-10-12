import React from "react"
import AllActionNums from "./AllActionNums"
import dots from "./../img/dots.svg"
import PickColor from "./PickColor"

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

	const [show, setShow] = React.useState(false)
	function toggleAddTodo() {
		setShow(prevState => !prevState)
	}

	// ! colors
	const colorsObj = JSON.parse(document.cookie.match(/colors={.*?}/)[0].replace(/colors=/, '')) // {taskName1: '#0aff95', taskName2: '#ff8585', ... }
	const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace(/tasks=/, '')) // {task1: 'taskName1', task2: 'taskName2' ... }

	const [colorState, setColorState] = React.useState(colorsObj)
	function changeColorState(event) {
		const { name, value } = event.target
		setColorState(prevState => {
			return { ...prevState, [name]: value }
		})
	}
	React.useEffect(() => {
		document.cookie = `colors=${JSON.stringify(colorState)}` // colors={"taskName1":"#8088ff","taskName2":"#ff8585" ... }
	}, [colorState])
	// ? colors
	// ! tasks
	const [taskState, setTaskState] = React.useState(tasksObj)
	function changeTaskState(event) {
		const { name, value } = event.target
		setTaskState(prevState => {
			return { ...prevState, [name]: value }
		})
	}
	React.useEffect(() => {
		document.cookie = `tasks=${JSON.stringify(taskState)}` // tasks={"task1":"taskName1","task2":"taskName2" ... }
	}, [taskState])
	// ? tasks

	// ! pickColorHtmlElems
	const pickColorHtmlElems = Object.values(taskState).map((taskName, ind) => {
		const taskNum = "task" + (ind + 1)
		return <PickColor
			taskNum={taskNum}
			taskName={taskName}
			color={colorState[taskName]}
			changeTaskState={changeTaskState}
			changeColorState={changeColorState}
		/>
	})

	function addTask() {
		setTaskState(prevState => {
			const taskNum = "task" + (Object.keys(prevState).length + 1)
			return { ...prevState, [taskNum]: `${taskNum}` }
		})
	}

	function deleteLists() {
		const conf = window.confirm("Delete my lists?\n\nDefault lists will remain!")
		if (conf) {
			document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
			window.location.reload()
		}

	}

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

			<img className="dots_add-todo" src={dots} onClick={toggleAddTodo} />

			{
				show &&
				<>
					<div className="my-lists">
						<span className="how-to-use">?</span>My lists:<span className="delete-lists" onClick={deleteLists}>delete</span>
					</div>

					{pickColorHtmlElems}
					<div className="add-task" onClick={addTask}>+</div>

					<div className="add-todo-nums">
						<AllActionNums nums={{ allTodosNum, isDoneNum, isLikedNum, isHiddenNum }} />
					</div>
				</>
			}

		</div>
	)
}
import React from "react"
import AllActionNums from "./AllActionNums"
import dots from "./../img/dots.svg"

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

	const [colorsData, setColorsData] = React.useState({
		[tasksObj.task1]: colorsObj[tasksObj.task1], // taskName1: #0aff95
		[tasksObj.task2]: colorsObj[tasksObj.task2],
		[tasksObj.task3]: colorsObj[tasksObj.task3],
	}
	)
	function changeColorsData(event) {
		const { name, value } = event.target
		setColorsData(prevState => {
			return { ...prevState, [name]: value }
		})
		document.cookie = `colors=${JSON.stringify(colorsData)}` // colors={"taskName1":"#8088ff","taskName2":"#ff8585" ... }
	}
	// ? colors
	// ! tasks
	const [taskData, setTaskData] = React.useState({
		task1: tasksObj.task1, // task1: 'taskName1'
		task2: tasksObj.task2,
		task3: tasksObj.task3,
	})
	function changeTaskData(event) {
		const { name, value } = event.target
		setTaskData(prevState => {
			return { ...prevState, [name]: value }
		})
		document.cookie = `tasks=${JSON.stringify(taskData)}` // tasks={"task1":"taskName1","task2":"taskName2" ... }
	}
	// ? tasks

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
					<div className="my-lists"><span className="how-to-use">?</span>My lists:</div>
					<div className="pick-color">
						<input
							className="task"
							type="text"
							name="task1"
							value={taskData.task1} // taskName1
							onChange={changeTaskData}
						/>
						<input
							type="color"
							name={tasksObj.task1} // taskName1
							value={colorsObj[tasksObj.task1]} // #000000
							onChange={changeColorsData} />
					</div>
					<div className="pick-color">
						<input
							className="task"
							type="text"
							name="task2"
							value={taskData.task2} // taskName2
							onChange={changeTaskData}
						/>
						<input
							type="color"
							name={tasksObj.task2} // taskName2
							value={colorsObj[tasksObj.task2]} // #000000
							onChange={changeColorsData} />
					</div>
					<div className="pick-color">
						<input
							className="task"
							type="text"
							name="task3"
							value={taskData.task3} // taskName3
							onChange={changeTaskData}
						/>
						<input
							type="color"
							name={tasksObj.task3} // taskName3
							value={colorsObj[tasksObj.task3]} // #000000
							onChange={changeColorsData} />
					</div>

					<div className="add-todo-nums">
						<AllActionNums nums={{ allTodosNum, isDoneNum, isLikedNum, isHiddenNum }} />
					</div>
				</>
			}

		</div>
	)
}
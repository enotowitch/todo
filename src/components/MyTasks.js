import React from "react"
import Task from "./Task"
import Tutorial from "./Tutorial"

export default function MyTasks(props) {

	// ! colors
	const colorsObj = JSON.parse(document.cookie.match(/colors={.*?}/)[0].replace(/colors=/, '')) // {taskName1: '#0aff95', taskName2: '#ff8585', ... }

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
	const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace(/tasks=/, '')) // {task1: 'taskName1', task2: 'taskName2' ... }

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
	// ! taskHtmlElems
	const reversedTaskStateKeys = []
	// todo make arr
	Object.keys(taskState).reverse().map(elem => reversedTaskStateKeys.push(elem))

	const addState = {}
	// todo make arr
	Object.keys(taskState).reverse().map(task => addState[task] = false)

	const [showAdd, setShowAdd] = React.useState(addState) // {"task2": false,"task1": false} ...
	function toggleAdd(taskNum) {
		setShowAdd(addState)
		setShowAdd(prevState => ({ ...prevState, [taskNum]: true }))
	}
	// todo make arr
	const taskHtmlElems = Object.values(taskState).reverse().map((taskName, ind) => {
		const taskNum = reversedTaskStateKeys[ind]
		return <Task
			taskNum={taskNum}
			taskName={taskName}
			color={colorState[taskName]}
			changeTaskState={changeTaskState}
			changeColorState={changeColorState}
			showAdd={showAdd[taskNum]}
			toggleAdd={toggleAdd}
		/>
	})
	// ! addTask
	function addTask() {
		const colors = ['#ff94c6', '#08b4ff', '#39a33d', '#4387c7', '#ffc1a9', '#c25b7a', '#ffd06a', '#89b10e', '#ffbbd2', '#ff9be5', '#cbfff5', '#dc8d96', '#f6a6b8', '#c9c5e8', '#9c9dd2', '#ffc19d', '#a0ffe6', '#a8b69a', '#b4a0bf', '#ff9407', '#c9bbd8', '#f6a3c1', '#e098c1', '#817ecd', '#f1c570']
		const randColor = Math.floor(Math.random() * colors.length)
		const taskNum = "task" + (Object.keys(taskState).length + 1)

		setTaskState(prevState => {
			return { ...prevState, [taskNum]: `${taskNum}` }
		})
		setColorState(prevState => {
			return { ...prevState, [taskNum]: colors[randColor] }
		})
	}
	// ! Tutorial
	const [showTutorial, setShowTutorial] = React.useState(false)
	function toggleTutorial() {
		setShowTutorial(prevState => !prevState)
	}



	return (
		<>
			<div className="my-tasks">
				<span className="tutorial-on" onClick={toggleTutorial}>?</span>
				My tasks:<span className="delete-tasks" onClick={props.togglePopUp}>delete</span>
			</div>

			<button className="add-task" onClick={addTask}>add task</button>

			<div className="tasks">
				{taskHtmlElems}
			</div>

			{showTutorial && <Tutorial />}
		</>
	)
}
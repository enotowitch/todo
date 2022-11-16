import React from "react"
import Task from "./Task"
import Tutorial from "./Tutorial"
import translate from "../functions/Translate"
import { Context } from "./../context"


export default function MyTasks(props) {

	const t = translate()

	// ! tasks
	const { tasks, setTasks } = React.useContext(Context)

	function changeTaskState(event) {
		const { name, value, type } = event.target
		// ! type text
		if (type === "text") {
			const oldName = name
			let newName = value

			let oldColor
			tasks.map(task => {
				task[oldName] && (oldColor = task[oldName])
			})

			setTasks(prevState => {
				return prevState.map(task => {
					// prevent dups; Object.keys(task) = taskName
					Object.keys(task) == newName && (newName = newName + "COPY")
					return Object.keys(task) == oldName ? { [newName]: oldColor } : task
				})
			})

		}
		// ! type color
		if (type === "color") {
			const sameName = name
			const newColor = value

			setTasks(prevState => {
				return prevState.map(task => (Object.keys(task) == sameName ? { [sameName]: newColor } : task))
			})
		}
	}
	React.useEffect(() => {
		document.cookie = `tasks=${JSON.stringify(tasks)}`
	}, [tasks])
	// ! showIcon
	const iconState = {}
	tasks.map(task => iconState[Object.keys(task)] = false)

	const [showIcon, setShowIcon] = React.useState(iconState) // {"taskName1": false,"taskName2": false} ...
	function toggleIcon(taskName) {
		setShowIcon(iconState) // all FALSE
		setShowIcon(prevState => ({ ...prevState, [taskName]: true })) // focused TRUE
	}
	// ? showIcon

	const taskHtmlElems = tasks.map(task => {
		return <Task taskName={Object.keys(task)} taskColor={Object.values(task)} changeTaskState={changeTaskState} showIcon={showIcon[Object.keys(task)]} toggleIcon={toggleIcon} />
	})
	// ! addTask
	function addTask() {
		const newColors = ['#ff94c6', '#08b4ff', '#39a33d', '#4387c7', '#ffc1a9', '#c25b7a', '#ffd06a', '#89b10e', '#ffbbd2', '#ff9be5', '#cbfff5', '#dc8d96', '#f6a6b8', '#c9c5e8', '#9c9dd2', '#ffc19d', '#a0ffe6', '#a8b69a', '#b4a0bf', '#ff9407', '#c9bbd8', '#f6a3c1', '#e098c1', '#817ecd', '#f1c570', '#f7d5ca', '#f7f7ca', '#caf7ca', '#caf7f7', '#cad5f7', '#e0caf7', '#d293d2']
		const newTasks = ['important', 'always', 'learn', 'remember', 'holiday', 'weekend', 'hobby', 'cook', 'buy', 'prepare', 'read', 'complete', 'sport', 'brainstorm', 'write', 'compose', 'meeting', 'upcoming', 'home', 'family', 'call', 'order', 'sell', 'visit', 'help', 'try', 'remind', 'check', 'repeat', 'report', 'fix', 'keep']

		let newTaskObj

		let found
		let color
		const lastNewTask = newTasks[newTasks.length - 1]

		tasks.map(task => {
			const eachTask = (String(Object.keys(task))) // november, ideas, work, important ...
			for (let i = 0; i < newTasks.length; i++) {
				if (eachTask == newTasks[i]) {
					found = newTasks[i + 1]
					color = newColors[newTasks.indexOf(newTasks[i + 1])]
					break
				}
				if (eachTask == lastNewTask) {
					found = `task1`
					color = "#ffffff"
					break
				}
				if (eachTask.includes("task")) {
					const num = Number(eachTask.match(/\d+/)[0])
					found = `task${num + 1}`
					color = "#ffffff"
					break
				}
			}
		})
		if (found === undefined) {
			found = newTasks[0]
			color = newColors[0]
		}
		newTaskObj = { [found]: color }

		setTasks(prevState => [...prevState, newTaskObj])
	}
	// ? addTask
	// ? tasks
	// ! Tutorial
	const [showTutorial, setShowTutorial] = React.useState(false)
	function toggleTutorial() {
		setShowTutorial(prevState => !prevState)
	}



	return (
		<>
			<div className="buttons">
				<button className="add-task" onClick={addTask}>{t[11]}</button>

				<span className="tutorial-on" onClick={toggleTutorial}>?</span>
				{showTutorial && <Tutorial />}
			</div>

			<div className="tasks">
				{taskHtmlElems.reverse()}
			</div>
		</>
	)
}
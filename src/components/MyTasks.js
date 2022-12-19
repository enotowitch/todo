import React from "react"
import Task from "./Task"
import Tutorial from "./Tutorial"
import translate from "../functions/Translate"
import { Context } from "./../context"
import setCookie from "../functions/setCookie"


export default function MyTasks() {

	const t = translate()

	// ! TASKS
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
		// ? type text
		// ! type color
		if (type === "color") {
			const sameName = name
			const newColor = value

			setTasks(prevState => {
				return prevState.map(task => (Object.keys(task) == sameName ? { [sameName]: newColor } : task))
			})
		}
		// ? type color
	}
	React.useEffect(() => {
		setCookie(`tasks=${JSON.stringify(tasks)}`)
	}, [tasks])
	// ? TASKS

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
		return <Task taskName={String(Object.keys(task))} taskColor={String(Object.values(task))} changeTaskState={changeTaskState} showIcon={showIcon[Object.keys(task)]} toggleIcon={toggleIcon} />
	})

	// ! addTask
	function addTask() {
		const newColors = ['#ff94c6', '#08b4ff', '#39a33d', '#4387c7', '#ffc1a9', '#c25b7a', '#ffd06a', '#89b10e', '#ffbbd2', '#ff9be5', '#cbfff5', '#dc8d96', '#f6a6b8', '#c9c5e8', '#9c9dd2', '#ffc19d', '#a0ffe6', '#a8b69a', '#b4a0bf', '#ff9407', '#c9bbd8', '#f6a3c1', '#e098c1', '#817ecd', '#f1c570', '#f7d5ca', '#f7f7ca', '#caf7ca', '#caf7f7', '#cad5f7', '#e0caf7', '#d293d2']
		const newTasks = [t[36], t[37], t[38], t[39], t[40], t[41], t[42], t[43], t[44], t[45], t[46], t[47], t[48], t[49], t[50], t[51], t[52], t[53], t[54], t[55], t[56], t[57], t[58], t[59], t[60], t[61], t[62], t[63], t[64], t[65], t[66], t[67]]

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
					color = "#fecece"
					break
				}
				if (eachTask.includes("task")) {
					const num = eachTask.match(/\d+/) ? Number(eachTask.match(/\d+/)[0]) : 0
					found = `task${num + 1}`
					color = "#fecece"
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

	// ! Tutorial
	const [showTutorial, setShowTutorial] = React.useState(false)
	function toggleTutorial() {
		setShowTutorial(prevState => !prevState)
	}
	// ? Tutorial



	// ! RETURN
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
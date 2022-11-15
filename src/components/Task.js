import React from "react"
import { Context } from "../context"
import add from "./../img/add.svg"
import del from "./../img/del.svg"

export default function Task(props) {

	function addTaskName() {
		document.querySelector('.input__text').value = props.taskName + " "
		document.querySelector('.input__text').focus()
	}

	const { tasks, setTasks } = React.useContext(Context)

	function deleteTask(taskName) {
		const deleted = tasks.filter(task => String(Object.keys(task)) != taskName)
		setTasks(deleted)
	}

	return (
		<div className="pick-color">
			{props.showIcon && <img src={add} onClick={addTaskName} />}
			<input
				className="task"
				type="text"
				name={props.taskName}
				value={props.taskName}
				onChange={props.changeTaskState}
				onFocus={() => props.toggleIcon(props.taskName)}
			/>
			<input
				type="color"
				name={props.taskName}
				value={props.taskColor}
				onChange={props.changeTaskState}
			/>
			{props.showIcon && <img src={del} onClick={() => deleteTask(props.taskName)} />}
		</div>
	)
}
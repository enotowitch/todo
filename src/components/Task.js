import React from "react"
import add from "./../img/add.svg"
import del from "./../img/del.svg"
import tasksObj from "./../functions/tasksObj"

export default function Task(props) {

	function addTaskName() {
		document.querySelector('.input__text').value = props.taskName + " "
		document.querySelector('.input__text').focus()
	}

	function deleteTask(taskNum) {
		const tasks = tasksObj()
		delete tasks[taskNum]
		props.setTaskState(tasks)
	}

	return (
		<div className="pick-color">
			{props.showAdd && <img src={add} onClick={addTaskName} />}
			<input
				className="task"
				type="text"
				name={props.taskNum}
				value={props.taskName}
				onChange={props.changeTaskState}
				onFocus={() => props.toggleAdd(props.taskNum)}
			/>
			<input
				type="color"
				name={props.taskName}
				value={props.color}
				onChange={props.changeColorState}
			/>
			{props.showAdd && <img src={del} onClick={() => deleteTask(props.taskNum)} />}
		</div>
	)
}
import React from "react"
import { Context } from "../context"
import makePopUp from "../functions/makePopUp"
import translate from './../functions/Translate'
import add from "./../img/add2.svg"
import dlt from "./../img/dlt2.svg"

export default function Task(props) {

	const t = translate()

	const { tasks, setTasks, setTaskForAddTodo, setInputOfAddTodo, setPopUpState, setShowPopUp } = React.useContext(Context)

	// ! deleteTask
	function deleteTask(taskName) {
		const deleted = tasks.filter(task => String(Object.keys(task)) != taskName)
		setTasks(deleted)
	}
	// ? deleteTask

	// ! addTaskName
	function addTaskName() {
		setTaskForAddTodo(props.taskName)
		// mandatoty, triggers input__text change => inputPadding for taskColor / add-todo__task
		setInputOfAddTodo(" ")
		document.querySelector('.input__text').focus()
	}
	// ? addTaskName

	// ! validation
	function validation(e) {
		const regExp = new RegExp(`[;{}\\[\\]]`)
		if (e.target.value.match(regExp)) {
			console.log(e.target.value)
			makePopUp({ imgName: "dlt", title: e.target.value.match(regExp)[0] + " " + t[70], setPopUpState, setShowPopUp, showTask: false })
			return
		}
		props.changeTaskState(e)
	}
	// ? validation



	// ! RETURN
	return (
		<div className="pick-color">
			{props.showIcon && props.taskName && <img src={add} onClick={addTaskName} />}
			<input
				className="task"
				type="text"
				name={props.taskName}
				value={props.taskName}
				onChange={validation}
				onFocus={() => (props.toggleIcon(props.taskName), setShowPopUp(false))}
			/>
			<input
				type="color"
				name={props.taskName}
				value={props.taskColor}
				onChange={props.changeTaskState}
			/>
			{props.showIcon && <img src={dlt} onClick={() => deleteTask(props.taskName)} />}
		</div>
	)
}
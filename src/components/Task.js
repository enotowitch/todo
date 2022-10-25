import React from "react"
import add from "./../img/add.svg"

export default function Task(props) {

	function addTaskName() {
		document.querySelector('.input__text').value = props.taskName + " "
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
		</div>
	)
}
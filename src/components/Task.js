import React from "react"

export default function Task(props) {
	return (
		<div className="pick-color">
			<input
				className="task"
				type="text"
				name={props.taskNum}
				value={props.taskName}
				onChange={props.changeTaskState}
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
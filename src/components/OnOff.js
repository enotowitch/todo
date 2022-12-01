import React from "react"

export default function OnOff(props) {
	return (
		<div className="on-off">
			<span>{props.title}</span>
			<input type="checkbox"
				className="on-off__checkbox"
				name={props.name}
				id={props.name}
				checked={props.showState}
				onChange={() => props.showSetState(prev => !prev)}
			/>
			<label className="on-off__label" htmlFor={props.name}></label>
		</div>
	)
}
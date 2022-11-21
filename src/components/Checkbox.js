import React from "react"
import translate from "../functions/Translate"
import done from "./../img/done.svg"

export default function Checkbox(props) {

	const t = translate()

	return (
		props.done ?
			<label className="todo__checkbox_label">
				<input className="todo__checkbox" type="checkbox" checked onChange={() => props.action(props.id, "done", t[2])} />
				<img src={done} />
			</label>
			:
			<label className="todo__checkbox_label">
				<input className="todo__checkbox" type="checkbox" onChange={() => props.action(props.id, "done", t[2])} />
			</label>
	)
}
import React from "react"
import { Context } from "../context"
import translate from "../functions/Translate"
import done from "./../img/done.svg"

export default function Checkbox(props) {

	const t = translate()

	const { action } = React.useContext(Context)

	return (
		props.done ?
			<label className="todo__checkbox_label">
				<input className="todo__checkbox" type="checkbox" checked onChange={() => action(props.id, "done", t[2])} />
				<img src={done} />
			</label>
			:
			<label className="todo__checkbox_label">
				<input className="todo__checkbox" type="checkbox" onChange={() => action(props.id, "done", t[2])} />
			</label>
	)
}
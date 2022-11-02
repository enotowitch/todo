import React from "react"
import translate from '../functions/translate'

const t = translate()

export default function Settings(props) {

	return (
		<div className="buttons">
			<button className="danger-button" onClick={props.deleteTodosPopUp}>{t[12]}</button>
			<button className="danger-button" onClick={props.deleteTasksPopUp}>{t[13]}</button>
		</div>
	)
}
import React from "react"
import translate from '../functions/Translate'


export default function Settings(props) {

	const t = translate()

	return (
		<div className="buttons">
			<button className="danger-button" onClick={props.deleteTodosPopUp}>{t[12]}</button>
			<button className="danger-button" onClick={props.deleteTasksPopUp}>{t[13]}</button>
		</div>
	)
}
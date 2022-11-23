import React from "react"
import OnOff from "./OnOff"
import { Context } from "../context"
import translate from '../functions/Translate'
import year from "../year"
import Todo from "./Todo"


export default function Settings(props) {

	const t = translate()

	const { showDate, setShowDate, showTask, setShowTask, todos, lang } = React.useContext(Context)

	// showDate
	React.useEffect(() => {
		document.cookie = `showDate=${showDate}`
	}, [showDate])
	// showTask
	React.useEffect(() => {
		document.cookie = `showTask=${showTask}`
	}, [showTask])

	// todo HAS 3 more DUPS => search "dateTranslated ="
	let dateTranslated
	todos[4] && (dateTranslated = year.EN.indexOf(todos[4].date)) // index 0-364, "use" year[UK][114]

	return (
		<>
			<div className="buttons">
				<OnOff title="Date" name="showDate" showState={showDate} showSetState={setShowDate} />
				<OnOff title="Task" name="showTask" showState={showTask} showSetState={setShowTask} />
			</div>

			{todos[4] && <Todo {...todos[4]} showDate={showDate} showTask={showTask} dateTranslated={year[lang][dateTranslated]} cssClass={"todo_settings"} />}

			<div className="buttons">
				<button className="button_danger" onClick={props.deleteTodosPopUp}>{t[12]}</button>
				<button className="button_danger" onClick={props.deleteTasksPopUp}>{t[13]}</button>
			</div>
		</>
	)
}
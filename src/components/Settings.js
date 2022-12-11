import React from "react"
import OnOff from "./OnOff"
import { Context } from "../context"
import translate from '../functions/Translate'
import Todo from "./Todo"
import setCookie from "../functions/setCookie"
import makePopUp from "../functions/makePopUp"


export default function Settings() {

	const t = translate()

	const { showDate, setShowDate, showTask, setShowTask, todos, lang, setPopUpState, setShowPopUp } = React.useContext(Context)

	// ! deleteTasksPopUp
	function deleteTasksPopUp() {
		makePopUp({ title: t[13].charAt(0).toUpperCase() + t[13].slice(1) + "?", setPopUpState, setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTasks", showTask: false })
	}
	// ! deleteTodosPopUp
	function deleteTodosPopUp() {
		makePopUp({ title: t[12].charAt(0).toUpperCase() + t[12].slice(1) + "?", setPopUpState, setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTodos", showTask: false })
	}

	// showDate
	React.useEffect(() => {
		setCookie(`showDate=${showDate}`)
	}, [showDate])
	// showTask
	React.useEffect(() => {
		setCookie(`showTask=${showTask}`)
	}, [showTask])

	// ! todo DELETE LATER
	function drop() {
		localStorage.clear()
		document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
		window.location.reload()
	}
	// ? todo DELETE LATER

	return (
		<>
			<div className="buttons">
				<OnOff title={t[69]} name="showDate" showState={showDate} showSetState={setShowDate} />
				<OnOff title={t[17]} name="showTask" showState={showTask} showSetState={setShowTask} />
			</div>

			{todos[4] && <Todo {...todos[4]} cssClass={"todo_settings"} />}

			<div className="buttons">
				<button className="button_danger" onClick={deleteTodosPopUp}>{t[12]}</button>
				<button className="button_danger" onClick={deleteTasksPopUp}>{t[13]}</button>
				{/* // ! todo DELETE LATER */}
				<button className="button_danger" onClick={drop}>DROP</button>
				{/* // ? todo DELETE LATER */}
			</div>
		</>
	)
}
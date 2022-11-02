import React from "react"
import makePopUp from "../functions/makePopUp"
import MenuItem from "./MenuItem"
import MyTasks from "./MyTasks"
import Settings from "./Settings"
import Language from "./Language"
import getCookie from "./../functions/getCookie"
import translate from '../functions/translate'

const t = translate()

export default function AddTodo(props) {

	const [text, setText] = React.useState("")

	function getText(event) {
		setText(event.target.value)
	}
	function clearText() {
		setText("")
	}

	// ! deleteTasksPopUp
	function deleteTasksPopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp({ title: t[13].charAt(0).toUpperCase() + t[13].slice(1) + "?", setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTasks" })
	}
	// ! deleteTodosPopUp
	function deleteTodosPopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp({ title: t[12].charAt(0).toUpperCase() + t[12].slice(1) + "?", setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTodos" })
	}

	// todo HAS DUP
	const [menu, setMenu] = React.useState([
		{
			title: t[8],
			content: <MyTasks />,
			id: 0,
			isShown: true,
			hasClose: false
		},
		{
			title: t[9],
			content: <Settings deleteTasksPopUp={deleteTasksPopUp} deleteTodosPopUp={deleteTodosPopUp} />,
			id: 1,
			isShown: true,
			hasClose: false
		},
		{
			title: t[10],
			content: <Language />,
			id: 2,
			isShown: true,
			hasClose: false
		}
	])

	// ! toggleMenuContent
	function toggleMenuContent(toggleId) {
		setMenu(prevState => prevState.map(elem => {
			return elem.id === toggleId ? { ...elem, isShown: true, hasClose: true } : { ...elem, isShown: false }
		}))
	}
	// ! showAllmenu
	function showAllmenu() {
		setMenu(prevState => prevState.map(elem => {
			return { ...elem, isShown: true, hasClose: false }
		}))
	}

	const menuHtmlElems = menu.map(elem => <MenuItem {...elem} toggleMenuContent={toggleMenuContent} showAllmenu={showAllmenu} />)

	const date = getCookie("dateForAddTodo")

	return (
		<div className="add-todo">
			<div className="add-todo__date">{t[5]}: {date}</div>
			<input
				className="input__text"
				type="text"
				placeholder={t[6]}
				autoFocus
				value={text}
				onChange={getText} />
			<div className="buttons">
				<button onClick={() =>
					props.addTodo(text, "one",
						clearText())
				}>{t[7]}</button>
			</div>

			{menuHtmlElems}
		</div>
	)
}
import React from "react"
import makePopUp from "../functions/makePopUp"
import MenuItem from "./MenuItem"
import MyTasks from "./MyTasks"
import Settings from "./Settings"
import getCookie from "./../functions/getCookie"
import Tutorial from "./Tutorial"

export default function AddTodo(props) {

	const [text, setText] = React.useState("")

	function getText(event) {
		setText(event.target.value)
	}
	function clearText() {
		setText("")
	}

	// ! delTasksPopUp
	function delTasksPopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp("", "Delete my tasks?", "", props.setPopUpState, props.setShowPopUp, "confirm")
	}

	// todo HAS DUP
	const [menu, setMenu] = React.useState([
		{
			title: "My Tasks",
			content: <MyTasks />,
			id: 0,
			isShown: true,
			hasClose: false
		},
		{
			title: "Settings",
			content: <Settings delTasksPopUp={delTasksPopUp} />,
			id: 1,
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
	// ! Tutorial
	const [showTutorial, setShowTutorial] = React.useState(false)
	function toggleTutorial() {
		setShowTutorial(prevState => !prevState)
	}

	const menuHtmlElems = menu.map(elem => <MenuItem {...elem} toggleMenuContent={toggleMenuContent} showAllmenu={showAllmenu} />)

	const date = getCookie("dateForAddTodo")

	return (
		<div className="add-todo">
			<div className="add-todo__date">Add Todo: {date}</div>
			<input
				className="input__text"
				type="text"
				placeholder="ADD ONE: todo. or ADD MANY: todo1, todo2, ..."
				autoFocus
				value={text}
				onChange={getText} />
			<div className="add-todo__buttons">
				<button onClick={() =>
					props.addTodo(text, "one",
						clearText())
				}>add one</button>

				<button onClick={() =>
					props.addTodo(text, "many",
						clearText())
				}>add many</button>
				<span className="tutorial-on" onClick={toggleTutorial}>?</span>
			</div>

			{menuHtmlElems}
			{showTutorial && <Tutorial />}
		</div>
	)
}
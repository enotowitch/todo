import React from "react"
import makePopUp from "../functions/makePopUp"
import MenuItem from "./MenuItem"
import MyTasks from "./MyTasks"
import Settings from "./Settings"

export default function AddTodo(props) {

	const [text, setText] = React.useState("")

	function getText(event) {
		setText(event.target.value)
	}
	function clearText() {
		setText("")
	}

	// ! togglePopUp
	function togglePopUp() {
		props.setShowPopUp(prevState => !prevState)
		makePopUp("", "Delete my tasks?", "", props.setPopUpState, props.setShowPopUp, "confirm")
	}

	const [menu, setMenu] = React.useState([
		{
			title: "My Tasks",
			content: <MyTasks togglePopUp={togglePopUp} />,
			id: 0,
			isShown: true,
			hasClose: false
		},
		{
			title: "Settings",
			content: <Settings />,
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

	const menuHtmlElems = menu.map(elem => <MenuItem {...elem} toggleMenuContent={toggleMenuContent} showAllmenu={showAllmenu} />)

	return (
		<div className="add-todo">
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

				{/* <button onClick={() =>
					props.addTodo(`Test Task ${localStorage.length + 1}`)
				}>test</button> */}
			</div>

			{menuHtmlElems}
		</div>
	)
}
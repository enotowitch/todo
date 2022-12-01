import React from "react"
import makePopUp from "../functions/makePopUp"
import MenuItem from "./MenuItem"
import MyTasks from "./MyTasks"
import Settings from "./Settings"
import Language from "./Language"
import getCookie from "./../functions/getCookie"
import translate from '../functions/Translate'
import { Context } from "../context"
import add from "./../img/add2.svg"


export default function AddTodo(props) {

	const t = translate()

	const { inputOfAddTodo, setInputOfAddTodo, taskForAddTodo, setTaskForAddTodo } = React.useContext(Context)
	// ! deleteTasksPopUp
	function deleteTasksPopUp() {
		makePopUp({ title: t[13].charAt(0).toUpperCase() + t[13].slice(1) + "?", setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTasks", showTask: false })
	}
	// ! deleteTodosPopUp
	function deleteTodosPopUp() {
		makePopUp({ title: t[12].charAt(0).toUpperCase() + t[12].slice(1) + "?", setPopUpState: props.setPopUpState, setShowPopUp: props.setShowPopUp, modalWindowType: "confirm", doFunction: "deleteTodos", showTask: false })
	}

	const menuArr = [
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
	]
	const [menu, setMenu] = React.useState(menuArr)
	// translate menu when lang changes // todo needs double click on "Language" after lang changes
	React.useEffect(() => { setMenu(menuArr) }, [t])

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

	const dateTranslated = getCookie("dateTranslated")

	const prevTask = document.cookie.match(/prevTask/) ? document.cookie.match(/prevTask=.*?}/)[0].replace(/prevTask=/, '').replace(/}/, '') : undefined

	React.useEffect(() => {
		taskForAddTodo && (document.cookie = `prevTask=${taskForAddTodo}}`)
	}, [taskForAddTodo])

	function addPrevTask() {
		setTimeout(() => {
			setTaskForAddTodo(prevTask)
		}, 1);

		setInputOfAddTodo(prevTask + " ")
		document.querySelector('.input__text').focus()
	}

	// ! return
	return (
		<div className="add-todo">
			<div className="add-todo__date">{t[5]}: {dateTranslated}</div>
			<div className="add-todo__input-flex">
				{prevTask !== undefined && <img className="add-todo__add-img" src={add} onClick={addPrevTask} />}
				<input
					className="input__text"
					type="text"
					placeholder={t[6]}
					autoFocus
					value={inputOfAddTodo}
					onChange={(e) => setInputOfAddTodo(e.target.value)} />
			</div>
			<div className="buttons">
				<button className="button_main" onClick={() =>
					(props.addTodo(), setInputOfAddTodo(""), setTaskForAddTodo())
				}>{t[7]}</button>
			</div>

			{menuHtmlElems}
		</div>
	)
}
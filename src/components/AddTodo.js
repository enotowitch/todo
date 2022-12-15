import React from "react"
import MenuItem from "./MenuItem"
import MyTasks from "./MyTasks"
import Settings from "./Settings"
import Language from "./Language"
import getCookie from "./../functions/getCookie"
import translate from '../functions/Translate'
import { Context } from "../context"
import add from "./../img/add2.svg"
import setCookie from "../functions/setCookie"


export default function AddTodo(props) {

	const t = translate()

	const { inputOfAddTodo, setInputOfAddTodo, taskForAddTodo, setTaskForAddTodo, tasks } = React.useContext(Context)

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
			content: <Settings />,
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
	// translate menu when lang changes // todo needs double click on "Language" after lang changes // if fixed when array is in state(menu), then dateTranslated works wrong
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

	// ! prevTask
	const prevTask = document.cookie.match(/prevTask/) ? document.cookie.match(/prevTask=.*?}/)[0].replace(/prevTask=/, '').replace(/}/, '') : undefined

	React.useEffect(() => {
		taskForAddTodo && (setCookie(`prevTask=${taskForAddTodo}}`))
	}, [taskForAddTodo])

	function addPrevTask() {
		setTaskForAddTodo(prevTask)

		// mandatoty, triggers input__text change => inputPadding for taskColor / add-todo__task
		setInputOfAddTodo(" ")
		document.querySelector('.input__text').focus()
	}
	// ? prevTask
	// ! taskColor
	let taskColor
	if (taskForAddTodo) {
		tasks.map(task => String(Object.keys(task)).trim().replace(/\s{2,}/, ' ') == taskForAddTodo.trim().replace(/\s{2,}/, ' ') && (taskColor = String(Object.values(task))))
	}
	// ! post todo on enter
	React.useEffect(() => {
		document.querySelector('.input__text').addEventListener('keyup', function (e) {
			e.which === 13 && e.target.value && document.querySelector('.add-todo .button_main').click()
		})
	}, [])


	
	// ! RETURN
	return (
		<div className="add-todo">
			<div className="add-todo__date">{t[5]}: {dateTranslated}</div>
			<div className="add-todo__input-flex">
				<img className="add-todo__add-img" src={add} onClick={addPrevTask} style={{ opacity: prevTask === undefined && 0 }} />
				<span className="add-todo__task" style={{ color: taskColor }}>{taskForAddTodo}</span>
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
import React from "react"
import { Context } from "../context";
import makePopUp from "../functions/makePopUp";
import translate from '../functions/Translate'
import SelectLang from "./SelectLang";
import edit from "./../img/edit.svg"
import Todo from "./Todo";
import setCookie from "../functions/setCookie";


export default function PopUp(props) {

	const { todos, setTodos, tasks, setTasks, setPopUpState, setShowPopUp } = React.useContext(Context)

	const t = translate()

	const path = props.imgName ? `img/${props.imgName}.svg` : ""

	// ! find current todo text to display in editTodo, deleteTodo ...
	let curTodoText
	todos.map(todo => todo.id === props.todoId && (curTodoText = todo.text))

	// ! deleteTasks
	function deleteTasks() {
		setTasks([])
		makePopUp({ imgName: "dlt", title: t[31], setPopUpState, setShowPopUp, showTask: false })
	}
	// ! editTodo
	function editTodo() {
		const editText = document.querySelector('[name="edit"]').value
		// state
		setTodos(prevState => {
			return prevState.map(todo => {
				return todo.id === props.todoId ? { ...todo, text: editText } : todo
			})
		})
		makePopUp({ imgName: "edit", text: curTodoText, title: t[32], setPopUpState, setShowPopUp, todoId: props.todoId })
	}
	// fix slow state for editTodo (state is one step behind)
	React.useEffect(() => {
		let text
		todos.map(todo => {
			return todo.id === props.todoId && (text = todo.text)
		})
		const edit = document.querySelector('[name="edit"]')
		edit && (edit.value = text + " ")
		edit && edit.focus()
	}, [props.todoId])
	// ? editTodo
	// ! deleteTodo
	function deleteTodo() {
		setTodos(prevState => prevState.filter(todo => {
			return todo.id !== props.todoId
		}))
		localStorage.removeItem(props.todoId)
		makePopUp({ imgName: "dlt", text: curTodoText, title: t[33], setPopUpState, setShowPopUp })
	}
	// ! deleteTodos
	function deleteTodos() {
		setCookie(`lastTodo="3"`) // ids 0-3 are for FAKE todos, used in DRAG & DROP
		localStorage.clear()
		window.location.reload()
	}
	// ! selectFn
	function selectFn() {
		setCookie(`langPopUp="shownOnce"`)
		setShowPopUp(false)
	}
	// ! modalWindowFunction
	function modalWindowFunction() {
		props.doFunction === "deleteTasks" && deleteTasks()
		props.doFunction === "editTodo" && editTodo()
		props.doFunction === "deleteTodo" && deleteTodo()
		props.doFunction === "deleteTodos" && deleteTodos()
		props.modalWindowType === "select" && selectFn()
	}

	let firstButtonText, buttonClass
	switch (props.modalWindowType) {
		case "confirm": firstButtonText = t[21]
			buttonClass = "button_danger"
			break;
		case "prompt": firstButtonText = t[22]
			buttonClass = "button_main"
			break;
		case "select": firstButtonText = t[29]
			break;
	}
	// ! taskName + taskColor
	let taskName
	todos.map(todo => todo.id === props.todoId && (taskName = todo.task))

	// ! if todo is deleted => write taskName to cookie
	props.imgName !== "dlt" && (setCookie(`deletedTodoTask=${taskName}}`))
	// get taskName - it's already deleted from state and locastorage, so only cookie works
	props.imgName === "dlt" && (taskName = document.cookie.match(/deletedTodoTask=.*?}/)[0].replace(/deletedTodoTask=/, '').replace(/}/, ''))
	// ? if todo is deleted => write taskname to cookie

	let taskColor
	tasks.map(task => String(Object.keys(task)).trim().replace(/\s{2,}/g, ' ') == taskName && (taskColor = String(Object.values(task))))

	taskName = (taskName === undefined || taskName === "undefined") ? t[19] : taskName
	// ? taskName + taskColor
	// ! lastTodo
	const lastTodo = todos.filter(todo => todo.id === props.todoId && todo) // lastTodo[0]
	const [showLastTodo, setShowLastTodo] = React.useState(false)


	// ! return
	return (
		<>
			<div className={props.modalWindowType || "popup"}>
				<img className="popup__img" src={path} />
				<p className="popup__title">
					<span>{props.title}</span>
					<br />
					{/* !!! undefined & true => showTask */}
					{props.showTask !== false && <span style={{ color: taskColor, fontWeight: 700, 'fontFamily': 'Montserrat' }}>{taskName}</span>}
					<br />
					<span className="popup__text">{props.text}</span>
				</p>


				<img className="popup__hide" src="img/del.svg" onClick={() => setShowPopUp(false)} />

				{showLastTodo && <img className="popup__hide2" src="img/del.svg" onClick={() => setShowPopUp(false)} />}

				{props.modalWindowType === "prompt" &&
					<textarea
						type="textarea"
						name="edit"
					/>
				}

				{props.modalWindowType === "select" &&
					<SelectLang />
				}

				{(props.modalWindowType) &&
					<div className="buttons">
						<button className={buttonClass} onClick={modalWindowFunction}>{firstButtonText}</button>
						<button onClick={() => setShowPopUp(false)}>{t[23]}</button>
					</div>
				}
				{/* show .edit_last-todo only in popup & when not deleting */}
				{!props.modalWindowType && props.imgName !== "dlt" &&
					<img className="edit_last-todo" src={edit} onClick={() => setShowLastTodo(true)} />
				}
				{showLastTodo && <Todo {...lastTodo[0]} dateTranslated={props.title} cssClass={"last-todo"} />}
			</div>
			{(props.modalWindowType) && <div className="popup__bg"></div>}
		</>
	)
}
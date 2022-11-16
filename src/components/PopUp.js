import React from "react"
import { Context } from "../context";
import makePopUp from "../functions/makePopUp";
import translate from '../functions/Translate'
import SelectLang from "./SelectLang";


export default function PopUp(props) {

	const { setTasks, setPopUpState, setShowPopUp } = React.useContext(Context)

	const t = translate()

	const path = props.imgName ? `img/${props.imgName}.svg` : ""

	// ! find current todo text to display in editTodo, deleteTodo ...
	let curTodoText
	props.todos.map(todo => todo.id === props.todoId && (curTodoText = todo.text))

	// ! deleteTasks
	function deleteTasks() {
		setTasks([])
		props.popUpHide()
		// todo makePopUp without passing setPopUpState, setShowPopUp each time => so it's already there...
		makePopUp({ imgName: "del", title: t[31], setPopUpState, setShowPopUp })
	}
	// ! editTodo
	function editTodo() {
		const editText = document.querySelector('[name="edit"]').value
		// state
		props.setTodos(prevState => {
			return prevState.map(todo => {
				return todo.id === props.todoId ? { ...todo, text: editText } : todo
			})
		})
		// popUpHide
		props.popUpHide()
		makePopUp({ imgName: "edit", text: curTodoText, title: t[32], setPopUpState, setShowPopUp })
	}
	// fix slow state for editTodo (state is one step behind)
	React.useEffect(() => {
		let text
		props.todos.map(elem => {
			return elem.id === props.todoId && (text = elem.text)
		})
		const edit = document.querySelector('[name="edit"]')
		edit && (edit.value = text + " ")
		edit && edit.focus()
	}, [props.todoId])
	// ? editTodo
	// ! deleteTodo
	function deleteTodo() {
		props.setTodos(prevState => prevState.filter(todo => {
			return todo.id !== props.todoId
		}))
		props.popUpHide()
		localStorage.removeItem(props.todoId)
		makePopUp({ imgName: "del", text: curTodoText, title: t[33], setPopUpState, setShowPopUp })
	}
	// ! deleteTodos
	function deleteTodos() {
		document.cookie = `lastTodo="3"`
		localStorage.clear()
		window.location.reload()
	}
	// ! selectFn
	function selectFn() {
		document.cookie = `langPopUp="shownOnce"`
		props.popUpHide()
	}
	// ! modalWindowFunction
	function modalWindowFunction() {
		props.doFunction === "deleteTasks" && deleteTasks()
		props.doFunction === "editTodo" && editTodo()
		props.doFunction === "deleteTodo" && deleteTodo()
		props.doFunction === "deleteTodos" && deleteTodos()
		props.modalWindowType === "select" && selectFn()
	}

	let firstButtonText
	switch (props.modalWindowType) {
		case "confirm": firstButtonText = t[21]
			break;
		case "prompt": firstButtonText = t[22]
			break;
		case "select": firstButtonText = t[29]
			break;
	}

	return (
		<>
			<div className={props.modalWindowType || "popup"}>
				<img className="popup__img" src={path} />
				<span className="popup__title">{props.title}</span>
				<span className="popup__text">{props.text}</span>
				<img className="popup__hide" src="img/del.svg" onClick={props.popUpHide} />

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
					<div className="confirm__buttons">
						<button onClick={modalWindowFunction}>{firstButtonText}</button>
						<button onClick={props.popUpHide}>{t[23]}</button>
					</div>
				}
			</div>
			{(props.modalWindowType) && <div className="popup__bg"></div>}
		</>
	)
}
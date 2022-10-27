import React from "react"

export default function PopUp(props) {
	const path = props.imgName ? `img/${props.imgName}.svg` : ""

	function deleteTasks() {
		document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
		window.location.reload()
	}
	// ! editTodo
	function editTodo() {
		const editText = document.querySelector('[name="edit"]').value
		// state
		props.setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === props.todoId ? { ...elem, text: editText } : elem
			})
		})
		// popUpHide
		props.popUpHide()
	}
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
	}
	const firstButtonText = props.modalWindowType === "confirm" ? "Delete" : "Edit"

	// todo REDO popUp, makePopUp (take object in params), pass only todo.id => not todo.text
	function modalWindowFunction() {
		props.doFunction === "deleteTasks" && deleteTasks()
		props.doFunction === "editTodo" && editTodo()
		props.doFunction === "deleteTodo" && deleteTodo()
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

				{(props.modalWindowType === "confirm" || props.modalWindowType === "prompt") &&
					<div className="confirm__buttons">
						<button onClick={modalWindowFunction}>{firstButtonText}</button>
						<button onClick={props.popUpHide}>Cancel</button>
					</div>
				}
			</div>
			{(props.modalWindowType === "confirm" || props.modalWindowType === "prompt") && <div className="popup__bg"></div>}
		</>
	)
}
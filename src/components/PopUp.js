import React from "react"

export default function PopUp(props) {
	const path = props.imgName ? `img/${props.imgName}.svg` : ""

	function deleteTasks() {
		document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
		window.location.reload()
	}
	function editTodo() {
		// get todo id by text
		let editId
		props.todos.map(elem => {
			elem.text === props.text && (editId = elem.id)
		})
		// state
		props.setTodos(prevState => {
			return prevState.map(elem => {
				return elem.id === editId ? { ...elem, text: inputState.edit } : elem
			})
		})
		// popUpHide
		props.popUpHide()
	}

	const [inputState, setInputState] = React.useState({ edit: props.text })
	function changeInputState(event) {
		const { name, value } = event.target
		setInputState(prevState => ({ ...prevState, [name]: value }))
	}
	const firstButtonText = props.modalWindowType === "confirm" ? "Delete" : "Edit"

	// todo REDO popUp, makePopUp (take object in params), pass only todo.id => not todo.text
	function modalWindowFunction() {
		props.doFunction === "deleteTasks" && deleteTasks()
		props.doFunction === "editTodo" && editTodo()
		props.doFunction === "deleteTodo" && window.location.reload()
	}

	React.useEffect(() => {
		// trigger change in textarea name="edit" so props.text works CORRECT
		document.querySelector('[name="edit"]') && (document.querySelector('[name="edit"]').value = props.text + " ")
	}, [props.text])

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
						value={inputState.edit}
						onChange={changeInputState}
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
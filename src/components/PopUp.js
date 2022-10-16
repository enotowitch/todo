import React from "react"

export default function PopUp(props) {
	const path = props.imgName ? `img/${props.imgName}.svg` : ""
	
	function deleteTasks() {
		document.cookie.split(";").forEach(function (c) { document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); });
		window.location.reload()
	}

	return (
		<div className={props.modalWindowType || "popup"}>
			<img className="popup__img" src={path} />
			<span className="popup__title">{props.title}</span>
			<span className="popup__text">{props.text}</span>
			<img className="popup__hide" src="img/delete.svg" onClick={props.popUpHide} />

			{props.modalWindowType === "confirm" &&
				<div className="confirm__buttons">
					<button onClick={deleteTasks}>Delete</button>
					<button onClick={props.popUpHide}>Cancel</button>
				</div>
			}
		</div>
	)
}
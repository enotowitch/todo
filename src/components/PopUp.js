import React from "react"

export default function PopUp(props) {
	const path = props.imgName ? `img/${props.imgName}.svg` : ""
	return (
		<div className="popup">
			<img className="popup__img" src={path} />
			<span className="popup__title">{props.title}</span>
			<span className="popup__text">{props.text}</span>
			<img className="popup__hide" src="img/delete.svg" onClick={props.popUpHide} />
		</div>
	)
}
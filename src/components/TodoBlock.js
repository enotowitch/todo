import React from "react"
import translate from "../functions/translate"
import ActionNum from "./ActionNum"
import arrow from "./../img/arrow.svg"

const t = translate()

export default function TodoBlock(props) {

	const arrowStyle = props.showBlock ? { "transform": "rotate(180deg) scale(.7)" } : { "transform": "rotate(0deg) scale(.7)" }

	return (
		<>
			<div className="todos-wrapper">
				<p className="todos-title" onClick={() => props.toggleBlock(props.cssClass)}>
					<span className={props.cssClass}>{props.title} <ActionNum num={props.num} /></span>
					{props.num > 0 && <img className="arrow arrow_action" src={arrow} style={arrowStyle} />}
				</p>
				<div>{props.showBlock && props.blockTodos}</div>
			</div>
		</>
	)
}
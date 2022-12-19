import React from "react"
import ActionNum from "./ActionNum"
import arrow from "./../img/arrow.svg"
import Todo from "./Todo"


export default function TodoBlock(props) {

	const arrowStyle = props.showBlock ? { "transform": "rotate(180deg) scale(.7)" } : { "transform": "rotate(0deg) scale(.7)" }

	const status = props.cssClass.replace(/Num/, "") // doing, done, canceled

	return (
		<>
			<div className="todos-wrapper">
				<div className="todos-title" onClick={() => props.toggleBlock(props.cssClass)}>
					{/* fake-todo for DRAG & DROP to (block) title */}
					{status === "all" && <Todo id={0} date={props.date} cssClass="fake-todo" />}
					{status === "doing" && <Todo id={1} date={props.date} {...{ [status]: true }} cssClass="fake-todo" />}
					{status === "done" && <Todo id={2} date={props.date} {...{ [status]: true }} cssClass="fake-todo" />}
					{status === "canceled" && <Todo id={3} date={props.date} {...{ [status]: true }} cssClass="fake-todo" />}

					<span className={props.cssClass}>{props.title} <ActionNum num={props.num} /></span>

					{props.num > 0 && <img className="arrow arrow_action" src={arrow} style={arrowStyle} />}
				</div>

				<div>{props.showBlock && props.blockTodos}</div>
				
			</div>
		</>
	)
}
import React from "react"
import ActionNum from "./ActionNum"

export default function ActionNums(props) {

	const nums = Object.values(props).map((val, ind) => <ActionNum num={val} class={Object.keys(props)[ind]} />)

	return (
		<div className="todos-nums">
			{nums}
		</div>
	)
}
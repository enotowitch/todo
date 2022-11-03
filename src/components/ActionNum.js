import React from "react"

export default function ActionNum(props) {
	return (
		<>
			{props.num > 0 && <span className={`todos-num ${props.cssClass}`}>{props.num}</span>}
		</>
	)
}
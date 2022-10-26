import React from "react"

export default function AllActionNums(props) {
	return (
		<div className="todos-nums">
			{props.nums.allTodosNum > 0 && <span className="todos-num">{props.nums.allTodosNum}</span>}
			{props.nums.doingNum > 0 && <span className="todos-num todos-num_doing">{props.nums.doingNum}</span>}
			{props.nums.doneNum > 0 && <span className="todos-num todos-num_done">{props.nums.doneNum}</span>}
			{props.nums.canceledNum > 0 && <span className="todos-num todos-num_canceled">{props.nums.canceledNum}</span>}
		</div>
	)
}
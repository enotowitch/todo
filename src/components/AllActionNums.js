import React from "react"

export default function AllActionNums(props) {
	return (
		<div className="todos-nums">
			{props.nums.allTodosNum > 0 && <span className="todos-num">{props.nums.allTodosNum}</span>}
			{props.nums.isDoneNum > 0 && <span className="todos-num todos-num_done">{props.nums.isDoneNum}</span>}
			{props.nums.isLikedNum > 0 && <span className="todos-num todos-num_liked">{props.nums.isLikedNum}</span>}
			{props.nums.isHiddenNum > 0 && <span className="todos-num todos-num_hidden">{props.nums.isHiddenNum}</span>}
		</div>
	)
}
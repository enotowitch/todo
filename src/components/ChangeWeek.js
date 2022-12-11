import React from "react"
import arrow from "./../img/arrow.svg"
import weeks from "./../weeks"
import { Context } from "./../context"
import dateTranslate from "../functions/dateTranslate"



export default function ChangeWeek(props) {

	const { lang, yearForAddTodo } = React.useContext(Context)

	const day1 = dateTranslate(weeks[props.weekNum][0], lang)
	const day2 = dateTranslate(weeks[props.weekNum][weeks[props.weekNum].length - 1], lang)

	return (
		<div className="changeWeek">
			<div className="year">{yearForAddTodo}</div>
			{<img className="arrow week-arrow arrow_prev" src={arrow} onClick={() => props.changeWeek("prev")} />}
			<div>
				{day1}
				<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
				{day2}
			</div>
			{<img className="arrow week-arrow arrow_next" src={arrow} onClick={() => props.changeWeek("next")} />}
		</div>
	)
}
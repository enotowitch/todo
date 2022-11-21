import React from "react"
import arrow from "./../img/arrow.svg"
import weeks from "./../weeks"
import { Context } from "./../context"



export default function ChangeWeek(props) {

	const { lang, yearForAddTodo } = React.useContext(Context)

	return (
		<div className="changeWeek">
			<div className="year">{yearForAddTodo}</div>
			{<img className="arrow week-arrow arrow_prev" src={arrow} onClick={() => props.changeWeek("prev")} />}
			<div>
				{weeks[lang][props.weekNum][0]}
				<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
				{weeks[lang][props.weekNum][weeks[lang][props.weekNum].length - 1]}
			</div>
			{<img className="arrow week-arrow arrow_next" src={arrow} onClick={() => props.changeWeek("next")} />}
		</div>
	)
}
import React from "react"
import arrow from "./../img/arrow.svg"
import normalizeDate from "./../functions/normalizeDate"
import weeks from "./../weeks"




export default function ChangeWeek(props) {

	return (
		<div className="changeWeek">
			{props.weekNum !== 0 && <img className="arrow week-arrow arrow_prev" src={arrow} onClick={() => props.changeWeek("prev")} />}
			<div>
				{normalizeDate(weeks[props.weekNum][0])}
				<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
				{normalizeDate(weeks[props.weekNum][weeks[props.weekNum].length - 1])}
			</div>
			{props.weekNum !== 52 && <img className="arrow week-arrow arrow_next" src={arrow} onClick={() => props.changeWeek("next")} />}
		</div>
	)
}
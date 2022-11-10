import React from "react"
import arrow from "./../img/arrow.svg"
import normalizeDate from "./../functions/normalizeDate"
import weeks from "./../weeks"
import defineLang from "../functions/defineLang"




export default function ChangeWeek(props) {

	const lang = defineLang()

	return (
		<div className="changeWeek">
			{props.weekNum !== 0 && <img className="arrow week-arrow arrow_prev" src={arrow} onClick={() => props.changeWeek("prev")} />}
			<div>
				{normalizeDate(weeks[lang][props.weekNum][0])}
				<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
				{normalizeDate(weeks[lang][props.weekNum][weeks[lang][props.weekNum].length - 1])}
			</div>
			{props.weekNum !== 52 && <img className="arrow week-arrow arrow_next" src={arrow} onClick={() => props.changeWeek("next")} />}
		</div>
	)
}
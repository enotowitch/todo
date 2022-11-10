import React from "react"
import arrow from "./../img/arrow.svg"
import normalizeDate from "./../functions/normalizeDate"
import weeks from "./../weeks"
import defineLang from "../functions/defineLang"




export default function ChangeWeek(props) {

	const lang = defineLang()

	const arrowPrevStyle = props.weekNum === 0 ? { "opacity": 0.1 } : { "opacity": 1 }
	const arrowNextStyle = props.weekNum === 52 ? { "opacity": 0.1 } : { "opacity": 1 }

	return (
		<div className="changeWeek">
			{<img className="arrow week-arrow arrow_prev" src={arrow} style={arrowPrevStyle} onClick={() => props.weekNum !== 0 && props.changeWeek("prev")} />}
			<div>
				{normalizeDate(weeks[lang][props.weekNum][0])}
				<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
				{normalizeDate(weeks[lang][props.weekNum][weeks[lang][props.weekNum].length - 1])}
			</div>
			{<img className="arrow week-arrow arrow_next" src={arrow} style={arrowNextStyle} onClick={() => props.weekNum !== 52 && props.changeWeek("next")} />}
		</div>
	)
}
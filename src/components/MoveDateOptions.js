import React from "react"
import { Context } from "../context"
import year from "./../year"
import dateTranslate from "../functions/dateTranslate"

export default function MoveDateOptions() {

	const { lang } = React.useContext(Context)

	const y = new Date().getFullYear()
	let moveDateOptions = []
	// this year + 2
	for (let i = 0; i <= 2; i++) {
		year.map((day) => moveDateOptions.push(<option value={day + ", " + (y + i * 1)}>{dateTranslate(day, lang) + ", " + (y + i * 1)}</option>))
	}

	return (
		moveDateOptions
	)
}
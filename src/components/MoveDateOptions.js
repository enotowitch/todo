import React from "react"
import { Context } from "../context"
import year from "./../year"

export default function MoveDateOptions() {

	const { lang } = React.useContext(Context)

	const y = new Date().getFullYear()
	let moveDateOptions = []
	// this year + 2
	for (let i = 0; i <= 2; i++) {
		year.EN.map((day, ind) => moveDateOptions.push(<option value={day + ", " + (y + i * 1)}>{year[lang][ind] + ", " + (y + i * 1)}</option>))
	}

	return (
		moveDateOptions
	)
}
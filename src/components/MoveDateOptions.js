import React from "react"
import { Context } from "../context"
import year from "./../year"

export default function MoveDateOptions() {

	const { lang } = React.useContext(Context)

	const moveDateOptions = year.EN.map((day, ind) => <option value={day}>{year[lang][ind]}</option>)

	return (
		moveDateOptions
	)
}
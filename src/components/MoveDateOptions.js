import React from "react"
import defineLang from "../functions/defineLang"
import year from "./../year"

export default function MoveDateOptions() {

	const lang = defineLang()

	const moveDateOptions = year.EN.map((day, ind) => <option value={day}>{year[lang][ind]}</option>)

	return (
		moveDateOptions
	)
}
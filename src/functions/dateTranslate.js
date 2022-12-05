import year from "../year"

export default function dateTranslate(date, lang) {

	const dateInd = year.EN.indexOf(date) // 320
	const dateTranslated = year[lang][dateInd] // Лист 17
	
	return (
		dateTranslated
	)
}
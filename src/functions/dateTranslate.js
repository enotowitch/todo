export default function dateTranslate(date, lang) {

	const month = new Date(`${date}`).toLocaleTimeString(lang, { month: 'short' }).match(/.*?\s/)[0].replace(/[,:]/g, '')
	const day = date.match(/\d+/)[0]

	return (
		month.slice(0, 1).toUpperCase() + month.slice(1) + day
	)
}
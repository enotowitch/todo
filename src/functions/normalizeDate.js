export default function normalizeDate(date) {
	let digits = (date.slice(date.match(/\d+/).index))
	let letters = (date.slice(date.match(/\D+/).index, date.match(/\d+/).index))
	return letters + " " + digits
}
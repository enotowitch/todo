export default function normalizeDate(date) {
	return date.slice(0, 3) + " " + date.match(/\d+/)
}
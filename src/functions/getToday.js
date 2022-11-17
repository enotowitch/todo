export default function getToday() {
	const dateObj = new Date()
	const today = dateObj.toLocaleString('en', { month: 'long' }).slice(0, 3) + " " + dateObj.getDate()
	return today
}
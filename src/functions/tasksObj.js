export default function tasksObj() {
	const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace(/tasks=/, ''))
	return (
		tasksObj
	)
}
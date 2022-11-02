import translation from './translation'

export default function translate() {

	const lang = document.cookie.match(/translate="\w+/) && document.cookie.match(/translate="\w+/)[0].replace(/translate="/, '')
	const t = lang === "UA" ? translation[0] : translation[1]

	return (
		t
	)
}
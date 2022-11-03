import defineLang from './defineLang'
import translation from './translation'

export default function translate() {

	const lang = defineLang()
	const t = lang === "UA" ? translation[0] : translation[1]

	return (
		t
	)
}
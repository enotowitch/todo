export default function defineLang() {
	return document.cookie.match(/translate="\w+/) && document.cookie.match(/translate="\w+/)[0].replace(/translate="/, '')
}
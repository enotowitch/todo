export default function defineLang() {
	return document.cookie.match(/lang="\w+/) && document.cookie.match(/lang="\w+/)[0].replace(/lang="/, '')
}
export default function getCookie(cookieName) {
	const exp = `${cookieName}=\\S+\\s\\d+|${cookieName}=\\w+|${cookieName}=.+\\s|${cookieName}=.+;|${cookieName}=.+'`
	const regExp = new RegExp(exp)
	return document.cookie.match(regExp)[0].replace(cookieName + "=", '').replace(/;/, '')
}
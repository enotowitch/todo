export default function getCookie(cookieName) {
	const exp = `${cookieName}=\\w*\\d*`
	const regExp = new RegExp(exp)
	return document.cookie.match(regExp)[0].replace(`${cookieName}=`, '')
}
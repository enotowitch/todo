export default function setCookie(string) {
	var expires = new Date(Date.now() + 473040000 * 1000); // + 15 years, 2022=>2037

	document.cookie = `${string}; expires=${expires}; max-age=473040000; path=/; SameSite=None; Secure;`
}
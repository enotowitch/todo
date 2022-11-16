// todo ip call at production
const location = Intl.DateTimeFormat().resolvedOptions().timeZone === "Europe/Kiev" ? "UK" : "EN"

export default function () {
	return location
}

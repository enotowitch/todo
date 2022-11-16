import React from "react"
import { Context } from "../context"

export default function SelectLang() {

	const { lang, setLang } = React.useContext(Context)

	return (
		<select
			name="lang"
			onChange={(e) => setLang(e.target.value)}
			value={lang}
		>
			<option value="UK">Українська</option>
			<option value="EN">English</option>
		</select>
	)
}
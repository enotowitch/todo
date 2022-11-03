import React from "react"
import defineLang from "../functions/defineLang"

export default function Language() {

	let curLang
	curLang = defineLang()

	const [langState, langStateSet] = React.useState({ lang: curLang })
	function langChange(event) {
		const { name, value } = event.target
		langStateSet(prevState => ({ ...prevState, [name]: value }))
		document.cookie = `translate="${value}"`
		window.location.reload()
	}

	return (
		<div className="buttons">
			<select
				name="lang"
				onChange={langChange}
				value={langState.lang}
			>
				<option value="UA">Українська</option>
				<option value="EN">English</option>
			</select>
		</div>
	)
}
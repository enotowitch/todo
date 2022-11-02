import React from "react"

export default function Language() {

	let curLang
	curLang = document.cookie.match(/translate="\w+/) && document.cookie.match(/translate="\w+/)[0].replace(/translate="/, '')

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
				<option>UA</option>
				<option>EN</option>
			</select>
		</div>
	)
}
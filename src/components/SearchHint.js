import React from "react"
import translate from './../functions/Translate'

export default function SearchHint(props) {

	const t = translate()

	return (
		<div className="search__hint">
			<div>{t[28]} <span onClick={() => props.setSearchState({ status: 'todo', optionText: t[0] })}>{t[0]}</span></div>
			<div>{t[28]} <span className="doing" onClick={() => props.setSearchState({ status: 'doing', optionText: t[1] })}>{t[1]}</span></div>
			<div>{t[28]} <span className="done" onClick={() => props.setSearchState({ status: 'done', optionText: t[2] })}>{t[2]}</span></div>
			<div>{t[28]} <span className="canceled" onClick={() => props.setSearchState({ status: 'canceled', optionText: t[3] })}>{t[3]}</span></div>
		</div>
	)
}
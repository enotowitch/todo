import React from "react"
import translate from './../functions/Translate'

export default function SearchHint(props) {

	const t = translate()

	return (
		<div className="search__hint">

			<div className="found">{t[35]}</div>

			<div>{t[28]} <span onClick={() => props.setSearchState({ task: '', status: 'todo', text: '', optionText: t[0] })}>{t[0]}</span></div>
			<div>{t[28]} <span className="doing" onClick={() => props.setSearchState({ task: '', status: 'doing', text: '', optionText: t[1] })}>{t[1]}</span></div>
			<div>{t[28]} <span className="done" onClick={() => props.setSearchState({ task: '', status: 'done', text: '', optionText: t[2] })}>{t[2]}</span></div>
			<div>{t[28]} <span className="canceled" onClick={() => props.setSearchState({ task: '', status: 'canceled', text: '', optionText: t[3] })}>{t[3]}</span></div>

			<div className="show-all" onClick={() => props.setSearchState({ task: '', status: '', text: '' })}>{t[34]}</div>
		</div>
	)
}
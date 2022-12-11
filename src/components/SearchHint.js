import React from "react"
import translate from './../functions/Translate'

export default function SearchHint(props) {

	const t = translate()

	function createHint(task, stat, translateId) {
		return (
			<div className={stat} onClick={() => props.setSearchState({ task: task || '', status: stat, text: '', optionText: t[translateId] })}><div className="search__hint-task">{task || t[19]}</div>&nbsp;-&nbsp;<span>{t[translateId]}</span></div>
		)
	}

	return (
		<div className="search__hint">

			<div className="found">{t[35]}</div>


			{props.searchState.task && props.searchState.task != "undefined" &&
				<>
					<div className="search__hint-title">{t[28]}:</div>
					{createHint(props.searchState.task, "doing", 1)}
					{createHint(props.searchState.task, "done", 2)}
					{createHint(props.searchState.task, "canceled", 3)}
				</>
			}

			<div className="search__hint-title">{t[28]}:</div>

			{createHint(undefined, "doing", 1)}
			{createHint(undefined, "done", 2)}
			{createHint(undefined, "canceled", 3)}

			<div className="show-all" onClick={() => props.setSearchState({ task: '', status: '', text: '' })}>{t[34]}</div>
		</div>
	)
}
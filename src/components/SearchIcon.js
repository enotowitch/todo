import React from "react"
import search from "./../img/search.svg"
import del from "./../img/del.svg"

export default function SearchIcon(props) {

	function showSearch() {
		props.setShowSection({ addTodo: false, week: false, search: true })
		document.querySelector('#burger__toggle').checked = false
	}
	function hideSearch() {
		props.setShowSection({ addTodo: false, week: true, search: false })
	}

	return (
		<>
			{!props.showSection.search && <img className="search__icon" src={search} onClick={showSearch} />}
			{props.showSection.search && <img className="search__icon search__icon_del" src={del} onClick={hideSearch} />}
		</>
	)
}
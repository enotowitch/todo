import React from "react"
import search from "./../img/search.svg"
import del from "./../img/del.svg"
import { Context } from "../context"

export default function SearchIcon() {

	const { showSection, setShowSection } = React.useContext(Context)

	function showSearch() {
		setShowSection({ addTodo: false, week: false, search: true })
		document.querySelector('#burger__toggle').checked = false
	}
	function hideSearch() {
		setShowSection({ addTodo: false, week: true, search: false })
	}

	return (
		<>
			{!showSection.search && <img className="search__icon" src={search} onClick={showSearch} />}
			{showSection.search && <img className="search__icon search__icon_del" src={del} onClick={hideSearch} />}
		</>
	)
}
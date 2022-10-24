import React from "react"
import del from "./../img/del.svg"

export default function SearchTag(props) {
	return (
		<div className="search-tag" onClick={props.toggleReverse}>
			<span className="search-tag__title">{props.title}:</span>
			<span className="search-tag__text">{props.text}</span>
			{props.showDel && <img className="search-tag_del" src={del} onClick={() => props.delTag(props.title)} />}
		</div>
	)
}
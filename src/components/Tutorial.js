import React from "react"
import { Context } from "../context"

export default function Tutorial() {

	const { lang } = React.useContext(Context)

	try {
		var tutorial = require(`./../img/tutorial_${lang}.gif`)
	} catch (ex) {
		var tutorial = require(`./../img/tutorial_EN.gif`)
	}

	return (
		<div className="tutorial-wrap">
			<img className="tutorial" src={tutorial} />
		</div>
	)
}
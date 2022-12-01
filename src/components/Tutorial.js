import React from "react"
import { Context } from "../context";

export default function Tutorial() {

	const { lang } = React.useContext(Context)

	const tutorial = require(`./../img/tutorial_${lang}.gif`);

	return (
		<div className="tutorial-wrap">
			<img className="tutorial" src={tutorial} />
		</div>
	)
}
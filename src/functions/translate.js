import React from 'react'
import { Context } from '../context'
import defineLang from './defineLang'
import translation from './translation'

export default function Translate() {

	const obj = { lang: defineLang() }
	const { lang } = React.useContext(Context) || obj

	const t = lang === "UK" ? translation[0] : translation[1]

	return (
		t
	)
}
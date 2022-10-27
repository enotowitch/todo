import React from "react"
import arrow from "./../img/arrow.svg"

export default function Scroll() {

	window.onscroll = function () { scroll() }
	function scroll() {
		if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
			document.querySelector(".scroll").style.display = "block"
		} else {
			document.querySelector(".scroll").style.display = "none"
		}
	}

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	return (
		<img src={arrow} className="arrow scroll" onClick={scrollTop} />
	)
}
import React from "react"
import arrow from "./../img/arrow.svg"

export default function MenuItem(props) {
	return (
		<>
			{props.isShown &&
				<>
					<div className="menu__title">
						<span>{props.title}</span>
						{!props.hasClose && <img className="arrow" src={arrow} onClick={() => props.toggleMenuContent(props.id)} />}
						{props.hasClose && <img className="arrow view-arrow" src={arrow} onClick={props.showAllmenu} />}
					</div>

					{/* show content only if title is clicked => hasClose icon */}
					{props.hasClose && <div className="menu__content">{props.content}</div>}
				</>
			}
		</>
	)
}
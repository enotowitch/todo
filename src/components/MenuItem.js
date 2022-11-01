import React from "react"
import arrow from "./../img/arrow.svg"

export default function MenuItem(props) {

	const [counter, setCounter] = React.useState(0)

	function toggle() {
		setCounter(prevState => prevState + 1)

		if (counter % 2 === 0) {
			return props.toggleMenuContent(props.id)
		} else {
			return props.showAllmenu()
		}
	}

	
	return (
		<>
			{props.isShown &&
				<>
					<div className="menu__title" onClick={toggle}>
						<span>{props.title}</span>
						{!props.hasClose && <img className="arrow" src={arrow} />}
						{props.hasClose && <img className="arrow view-arrow" src={arrow} />}
					</div>

					{/* show content only if title is clicked => hasClose icon */}
					{props.hasClose && <div className="menu__content">{props.content}</div>}
				</>
			}
		</>
	)
}
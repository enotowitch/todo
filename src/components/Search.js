import React from "react"
import search from "./../img/search.svg"
import del from "./../img/del.svg"
import Todo from "./Todo"

export default function Search(props) {

	const tasksObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace('tasks=', ''))
	const options = Object.values(tasksObj).reverse().map(elem => <option>{elem}</option>)

	const [searchState, setSearchState] = React.useState({})
	function changeSearchState(event) {
		const { name, value } = event.target
		setSearchState(prevState => ({ ...prevState, [name]: value }))
		if (name === "text") {
			setSearchState(prevState => ({ ...prevState, select: "choose task" }))
		}
		if (name === "select") {
			setSearchState(prevState => ({ ...prevState, text: "" }))
		}
	}

	let searchedTodos
	searchedTodos = props.todos.map((elem, ind) => {
		let taskName
		// check if first word === searchState.select
		elem.text.match(/.*?\s/) && (taskName = elem.text.match(/.*?\s/)[0].trim().toLowerCase())
		return taskName === searchState.select && <Todo showDate={true} key={ind} {...elem} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} />
	})

	if (searchState.select === "all") {
		searchedTodos = props.todos.map((elem, ind) => {
			return !elem.isHidden && <Todo showDate={true} key={ind} {...elem} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} />
		})
	}
	// isDone
	if (searchState.select === "done") {
		searchedTodos = props.todos.map((elem, ind) => {
			return elem.isDone && <Todo showDate={true} key={ind} {...elem} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} />
		})
	}
	// isLiked
	if (searchState.select === "liked") {
		searchedTodos = props.todos.map((elem, ind) => {
			return elem.isLiked && <Todo showDate={true} key={ind} {...elem} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} />
		})
	}
	// isHidden
	if (searchState.select === "hidden") {
		searchedTodos = props.todos.map((elem, ind) => {
			return elem.isHidden && <Todo showDate={true} key={ind} {...elem} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} />
		})
	}
	// text
	if (searchState.text) {
		searchedTodos = props.todos.map((elem, ind) => {
			return elem.text.includes(searchState.text) && <Todo showDate={true} key={ind} {...elem} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} />
		})
	}




	return (
		<>
			{props.showWeek && <img className="search" src={search} onClick={props.toggleWeek} />}

			{!props.showWeek &&
				<>
					<div className="search__title">Search</div>
					<img className="search search_del" src={del} onClick={props.toggleWeek} />

					<>
						<input type="text"
							name="text"
							value={searchState.text}
							onChange={changeSearchState}
							placeholder="todo text"
						/>
						<select
							name="select"
							value={searchState.select}
							onChange={changeSearchState}
						>
							<option selected disabled>choose task</option>
							<optgroup label="Default">
								<option>all</option>
								<option>done</option>
								<option>liked</option>
								<option>hidden</option>
							</optgroup>
							<optgroup label="Custom">
								{options}
							</optgroup>
						</select>
						{searchedTodos}
					</>

				</>
			}
		</>
	)
}
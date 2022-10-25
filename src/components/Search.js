import React from "react"
import search from "./../img/search.svg"
import del from "./../img/del.svg"
import add from "./../img/add.svg"
import Todo from "./Todo"
import SearchTag from "./SearchTag"
import getToday from "../functions/getToday"

export default function Search(props) {

	const taskObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace('tasks=', ''))
	const taskOptions = Object.values(taskObj).reverse().map(elem => <option>{elem}</option>)

	const [searchState, setSearchState] = React.useState({})
	function changeSearchState(event) {
		const { name, value } = event.target
		setSearchState(prevState => ({ ...prevState, [name]: value }))
	}

	// ! define textIds
	let textIds = props.todos.map((todo) => {
		return todo.text.includes(searchState.text) && todo.id
	})
	textIds = textIds.filter(isTrue => isTrue)
	// ! define statusIds
	let statusIds = props.todos.map((todo) => {
		if (searchState.status === "all") {
			return todo.id
		}
		if (searchState.status === "not done") {
			return !todo.isDone && todo.id
		}
		const s = searchState.status
		let status
		s && (status = "is" + s.charAt(0).toUpperCase() + s.slice(1))
		return todo[status] && todo.id
	})
	statusIds = statusIds.filter(isTrue => isTrue)
	// ! define taskIds	
	let taskIds = props.todos.map((todo) => {
		return todo.text.match(/\S+/) == searchState.task && todo.id
	})
	taskIds = taskIds.filter(isTrue => isTrue)

	// ! intersect
	const intersect = []
	textIds.length > 0 && intersect.push(textIds)
	statusIds.length > 0 && intersect.push(statusIds)
	taskIds.length > 0 && intersect.push(taskIds)


	let result = []
	for (let i = 0; i < intersect.length - 1; i++) {
		result = intersect[i].filter(val => intersect[i + 1].includes(val))
	}

	// if only one search
	intersect.length === 1 && (result = intersect[0])

	// if in input/select search is some val, but no ids 
	searchState.text && textIds.length == 0 && (result = [])
	searchState.status && statusIds.length == 0 && (result = [])
	searchState.task && taskIds.length == 0 && (result = [])


	function shortTodo(todo, ind) {
		return <Todo showDate={true} key={ind} {...todo} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} toggleAction={props.toggleAction} />
	}

	let searched = []
	for (let i = 0; i < result.length; i++) {
		// exclude HIDDEN and DONE todos
		if (searchState.status !== "hidden") {
			props.todos.map((todo, ind) => {
				todo.id === result[i] && !todo.isHidden && !todo.isDone && searched.push(shortTodo(todo, ind))
			})
		}
		// include HIDDEN or DONE todos
		if (searchState.status === "hidden" || searchState.status === "done") {
			props.todos.map((todo, ind) => {
				todo.id === result[i] && searched.push(shortTodo(todo, ind))
			})
		}
	}

	function delTag(name) {
		setSearchState(prevState => ({ ...prevState, [name]: "" }))
	}

	function addTodoTask() {
		document.cookie = `dateForAddTodo=${getToday()}`
		document.querySelector('.burger__btn').click()
		setTimeout(() => {
			document.querySelector('.input__text').value = searchState.task + " "
		}, 1);
	}

	const [reverseState, setReverseState] = React.useState(false)

	function toggleReverse() {
		setReverseState(prevState => !prevState)
	}

	let reverseNums
	reverseState ? (reverseNums = `1-${result.length}`) : (reverseNums = `${result.length}-1`)

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
							placeholder="text"
						/>
						<select
							name="status"
							value={searchState.status}
							onChange={changeSearchState}
						>
							<option value="" selected>status</option>
							<option>all</option>
							<option>done</option>
							<option>liked</option>
							<option>hidden</option>
							<option>not done</option>
						</select>
						<div className="task-wrap">
							<select
								name="task"
								value={searchState.task}
								onChange={changeSearchState}
							>
								<option value="" selected>task</option>
								{taskOptions}
							</select>
							{searchState.task && <img className="add-todo-task" src={add} onClick={addTodoTask} />}
						</div>

						<div className="search-tags">
							{result.length > 0 && <SearchTag text={reverseNums} title="order" showDel={false} toggleReverse={toggleReverse} />}
							{searchState.text && <SearchTag text={searchState.text} title="text" showDel={true} delTag={delTag} />}
							{searchState.status && <SearchTag text={searchState.status} title="status" showDel={true} delTag={delTag} />}
							{searchState.task && <SearchTag text={searchState.task} title="task" showDel={true} delTag={delTag} />}
						</div>

						{reverseState && searched}
						{!reverseState && searched.reverse()}
					</>

				</>
			}
		</>
	)
}
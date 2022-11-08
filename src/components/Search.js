import React from "react"
import search from "./../img/search.svg"
import del from "./../img/del.svg"
import add from "./../img/add.svg"
import Todo from "./Todo"
import SearchTag from "./SearchTag"
import getToday from "../functions/getToday"
import translate from '../functions/translate'
import arrow from "./../img/arrow.svg"

const t = translate()

export default function Search(props) {

	const taskObj = JSON.parse(document.cookie.match(/tasks={.*?}/)[0].replace('tasks=', ''))
	const taskOptions = Object.values(taskObj).reverse().map(elem => <option>{elem}</option>)

	const [searchState, setSearchState] = React.useState({ task: '', status: '', text: undefined })
	function changeSearchState(event) {

		setPage(0)

		let { name, value } = event.target

		// when text = "" drop it to undefined, so search does not show all todos (having empty text)
		if (name === "text") {
			value == "" && (value = undefined)
		}
		// add optionText for translated status
		if (name === "status") {
			const optionText = event.target.options[event.target.selectedIndex].text;
			setSearchState(prevState => ({ ...prevState, [name]: value, optionText: optionText }))
		}
		name !== "status" && setSearchState(prevState => ({ ...prevState, [name]: value }))
	}

	// ! define textIds
	let textIds = props.todos.map((todo) => {
		if (todo.text)
			return todo.text.includes(searchState.text) && todo.id
	})
	textIds = textIds.filter(isTrue => isTrue)
	// ! define statusIds
	let statusIds = props.todos.map((todo) => {
		// don't show fake-todos (have id 0-3) => used for drag & drop to (block) title
		if (todo.id <= 3) {
			return
		}

		// ! OUTPUT LOGIC
		// ALL aka TODO: -doing, -done, -canceled
		if (searchState.status === "todo") {
			return (!todo.doing && !todo.done && !todo.canceled) && todo.id
		}
		// DOING: +doing, -done, -canceled
		if (searchState.status === "doing") {
			return todo.doing && todo.id
		}
		// DONE: +done, -canceled
		if (searchState.status === "done") {
			return todo.done && todo.id
		}
		// CANCELED: +canceled
		if (searchState.status === "canceled") {
			return todo.canceled && todo.id
		}
		// ? OUTPUT LOGIC
	})
	statusIds = statusIds.filter(isTrue => isTrue)
	// ! define taskIds	
	let taskIds = props.todos.map((todo) => {
		// ! OUTPUT LOGIC
		// if search status is chosen add all task ids to search
		if (searchState.status) {
			return todo.task === searchState.task && todo.id
		}
		// if search status is NOT chosen: -doing, -done, -canceled
		if (!searchState.status) {
			return (todo.task === searchState.task && !todo.doing && !todo.done && !todo.canceled) && todo.id
		}
		// ? OUTPUT LOGIC
	})
	taskIds = taskIds.filter(isTrue => isTrue)

	// ! intersect
	const intersect = []
	textIds.length > 0 && intersect.push(textIds)
	statusIds.length > 0 && intersect.push(statusIds)
	taskIds.length > 0 && intersect.push(taskIds)

	let temp = [[]] // temp[0]

	let result = []
	for (let i = 0; i < intersect.length - 1; i++) {
		temp[i] = intersect[i].filter(val => intersect[i + 1].includes(val))
		if (intersect.length > 2) {
			temp.push([]) // temp[1]
			result = temp[0].filter(val => temp[1].includes(val))
		} else {
			result = temp[0]
		}
	}

	// if only one search
	intersect.length === 1 && (result = intersect[0])

	// if in input/select search is some val, but no ids 
	searchState.text && textIds.length == 0 && (result = [])
	searchState.status && statusIds.length == 0 && (result = [])
	searchState.task && taskIds.length == 0 && (result = [])


	function shortTodo(todo) {
		return <Todo showDate={true} key={todo.id} {...todo} action={props.action} moveTodo={props.moveTodo} moveTask={props.moveTask} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} toggleAction={props.toggleAction} />
	}

	let searched = []
	for (let i = 0; i < result.length; i++) {

		props.todos.map((todo, ind) => {
			todo.id === result[i] && searched.push(shortTodo(todo, ind))
		})
	}

	function delTag(name) {
		setSearchState(prevState => ({ ...prevState, [name]: "" }))
	}

	function addTodoTask() {
		document.cookie = `dateForAddTodo=${getToday()}`
		document.querySelector('.burger__btn').click()
		setTimeout(() => {
			document.querySelector('.input__text').value = searchState.task + " "
		}, 100);
	}
	// ! reverse
	const [reverseState, setReverseState] = React.useState(false)

	function toggleReverse() {
		setReverseState(prevState => !prevState)
	}

	searched = !reverseState ? searched.reverse() : searched
	// ? reverse

	// ! page, quantity
	const [page, setPage] = React.useState(0)
	const [quantityState, setQuantityState] = React.useState({ quantity: 5 })
	function changeQuantity(event) {

		setPage(0)

		const { name, value } = event.target
		setQuantityState(prevState => ({ ...prevState, [name]: Number(value) }))
	}
	// ! pages
	const pages = Math.ceil(searched.length / quantityState.quantity)

	const pageOptions = []
	for (let i = 0; i < pages; i++) {
		pageOptions.push(<option value={i}>{t[25]}: {i + 1}</option>)
	}

	function changePage(event) {
		setPage(Number(event.target.value))
	}

	function nextPage() {
		// prevent going to page that does not exist
		page !== pages - 1 && setPage(prevState => prevState + 1)
	}
	function prevPage() {
		page !== 0 && setPage(prevState => prevState - 1)
	}
	// ! hide arrows
	let arrowNext = document.querySelector('.arrow_search.arrow_next')
	if (page === pages - 1) {
		arrowNext && (arrowNext.style = "opacity:0.3")
	} else {
		arrowNext && (arrowNext.style = "opacity:1")
	}
	let arrowPrev = document.querySelector('.arrow_search.arrow_prev')
	if (page === 0) {
		arrowPrev && (arrowPrev.style = "opacity:0.3")
	} else {
		arrowPrev && (arrowPrev.style = "opacity:1")
	}
	// ! searchedMini
	const searchedMini = [[]]
	for (let i = 0, pages = 0, limit = 0; i < searched.length; i++) {
		searchedMini[pages].push(searched[i])
		limit++
		if (limit == quantityState.quantity) {
			searchedMini.push([])
			limit = 0
			pages++
		}
	}
	// ! search NUMS
	let num1, num2

	num1 = quantityState.quantity * page + 1
	num2 = quantityState.quantity * page + quantityState.quantity

	if (!reverseState) {
		num1 = searched.length - (quantityState.quantity * page)
		num2 = searched.length - (quantityState.quantity * page + quantityState.quantity - 1)
		num2 < 0 && (num2 = 1)
	}

	let searchedNum
	reverseState ? (searchedNum = `1-${searched.length}`) : (searchedNum = `${searched.length}-1`)

	// watch if after action (done, doing, cancel, moveTask, etc) => nothing to display => go to prev page
	searchedMini[page].length === 0 && prevPage()

	// ! return
	return (
		<>
			{props.showWeek && <img className="search__icon" src={search} onClick={props.toggleWeek} />}

			{!props.showWeek &&
				<div className="search">
					<div className="search__title">{t[14]}</div>
					<img className="search__icon search__icon_del" src={del} onClick={props.toggleWeek} />

					<>
						<input type="text"
							name="text"
							value={searchState.text}
							onChange={changeSearchState}
							placeholder={t[15]}
						/>
						<select
							name="status"
							value={searchState.status}
							onChange={changeSearchState}
						>
							<option value="" selected>{t[26]}</option>
							<option value="todo">{t[0]}</option>
							<option value="doing">{t[1]}</option>
							<option value="done">{t[2]}</option>
							<option value="canceled">{t[3]}</option>
						</select>
						<div className="task-wrap">
							<select
								name="task"
								value={searchState.task}
								onChange={changeSearchState}
							>
								<option value="" selected>{t[27]}</option>
								{taskOptions}
							</select>
							{searchState.task && <img className="add-todo-task" src={add} onClick={addTodoTask} />}
						</div>

						<div className="search-tags">
							{searched.length > 1 && <SearchTag text={searchedNum} titleTranslated={t[18]} showDel={false} toggleReverse={toggleReverse} />}
							{searchState.text && <SearchTag text={searchState.text} title="text" titleTranslated={t[15]} showDel={true} delTag={delTag} setPage={setPage} />}
							{searchState.status && <SearchTag text={searchState.optionText} title="status" titleTranslated={t[16]} showDel={true} delTag={delTag} setPage={setPage} />}
							{searchState.task && <SearchTag text={searchState.task} title="task" titleTranslated={t[17]} showDel={true} delTag={delTag} setPage={setPage} />}
						</div>

						{searched.length > quantityState.quantity &&
							<div className="search__pagination-wrap">
								<select
									name="quantity"
									value={quantityState.quantity}
									onChange={changeQuantity}
								>
									<option value="5">{t[24]}:&nbsp;5</option>
									<option value="10">{t[24]}:&nbsp;10</option>
									<option value="20">{t[24]}:&nbsp;20</option>
									<option value="30">{t[24]}:&nbsp;30</option>
								</select>
								<div className="search__pagination">
									<img className="arrow arrow_search arrow_prev" src={arrow} onClick={prevPage} />
									{num1}-{num2}
									<img className="arrow arrow_search arrow_next" src={arrow} onClick={nextPage} />
								</div>
								<select
									name="page"
									value={page}
									onChange={changePage}
								>
									{pageOptions}
								</select>
							</div>
						}

						{searchedMini[page]}
					</>
					<div className="search__bg"></div>
				</div>
			}
		</>
	)
}
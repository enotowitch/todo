import React from "react"
import add from "./../img/add2.svg"
import Todo from "./Todo"
import SearchTag from "./SearchTag"
import getToday from "../functions/getToday"
import translate from "../functions/Translate"
import arrow from "./../img/arrow.svg"
import SearchHint from "./SearchHint"
import { Context } from "./../context"
import makePopUp from "../functions/makePopUp"
import setCookie from "../functions/setCookie"


export default function Search() {

	const t = translate()

	const { todos, tasks, setTaskForAddTodo, setInputOfAddTodo, setPopUpState, setShowPopUp } = React.useContext(Context)
	const taskOptions = tasks.map(task => String(Object.keys(task)) && <option>{String(Object.keys(task))}</option>)

	const [searchCount, setSearchCount] = React.useState(0)

	// ! searchMemo, searchState, changeSearchState
	if (!document.cookie.match(/searchState=/)) {
		setCookie(`searchState=${JSON.stringify({ task: '', status: '', text: undefined })}`)
	}
	const searchMemo = JSON.parse(document.cookie.match(/searchState={.*?}/)[0].replace(/searchState=/, ''))

	// searchState
	const [searchState, setSearchState] = React.useState(searchMemo)

	function changeSearchState(event) {

		setSearchCount(1)
		setPage(0)

		let { name, value } = event.target

		if (name === "text") {
			// validation
			const regExp = new RegExp(`[;{}\\[\\]]`)
			if (value.match(regExp)) {
				setSearchState(prevState => ({ ...prevState, text: "" }))
				makePopUp({ imgName: "dlt", title: value.match(regExp)[0] + " " + t[70], setPopUpState, setShowPopUp, showTask: false })
				return
			}
			// when text = "" drop it to undefined, so search does not show all todos (having empty text)
			value == "" && (value = undefined)
		}
		// add optionText for translated status
		if (name === "status") {
			const optionText = event.target.options[event.target.selectedIndex].text;
			setSearchState(prevState => ({ ...prevState, [name]: value, optionText: optionText }))
		}
		name !== "status" && setSearchState(prevState => ({ ...prevState, [name]: value }))
	}
	// write searchState to cookie 
	React.useEffect(() => {
		setCookie(`searchState=${JSON.stringify(searchState)}`)
	}, [searchState])
	// ? searchMemo, searchState, changeSearchState

	// SEARCH
	// ! define textIds
	let textIds = todos.map((todo) => {
		if (todo.text && searchState.text) {
			return todo.text.toLowerCase().includes(searchState.text.toLowerCase()) && todo.id
		}
		// searchState.text == "" when .SHOW-ALL is clicked => so it's working
		if (todo.text && !searchState.text) {
			return todo.text.includes(searchState.text) && todo.id
		}
	})
	textIds = textIds.filter(isTrue => isTrue)
	// ? define textIds

	// ! define statusIds
	let statusIds = todos.map((todo) => {
		// don't show fake-todos (have id 0-3) => used for drag & drop to (block) title
		if (todo.id <= 3) {
			return
		}

		// ! OUTPUT LOGIC
		// ALL aka TODO: -doing, -done, -canceled
		if (searchState.status === "todo") {
			return (!todo.doing && !todo.done && !todo.canceled) && todo.id
		}
		// DOING: +doing
		if (searchState.status === "doing") {
			return todo.doing && todo.id
		}
		// DONE: +done
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
	// ? define statusIds

	// ! define taskIds	
	let taskIds = todos.map((todo) => {
		// ! OUTPUT LOGIC
		// if search status is chosen add all task ids to search
		if (searchState.status) {
			return todo.task === searchState.task && todo.id
		}
		// if search status is NOT chosen: -doing, -done, -canceled: show only todos with "TODO" STATUS
		if (!searchState.status) {
			return (todo.task === searchState.task && !todo.doing && !todo.done && !todo.canceled) && todo.id
		}
		// ? OUTPUT LOGIC
	})
	taskIds = taskIds.filter(isTrue => isTrue)
	// ? define taskIds

	// ! intersect
	const intersect = []
	textIds.length > 0 && intersect.push(textIds)
	statusIds.length > 0 && intersect.push(statusIds)
	taskIds.length > 0 && intersect.push(taskIds)

	let temp = [[]] // temp[0]

	// ! result
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
	// ? intersect

	// if in input/select search is some val, but no ids 
	searchState.text && textIds.length == 0 && (result = [])
	searchState.status && statusIds.length == 0 && (result = [])
	searchState.task && taskIds.length == 0 && (result = [])
	// ? result


	// ! searched
	function shortTodo(todo) {
		return <Todo key={todo.id} {...todo} />
	}

	let searched = []
	for (let i = 0; i < result.length; i++) {

		todos.map((todo) => {
			todo.id === result[i] && searched.push(shortTodo(todo))
		})
	}
	// ? searched

	// ! delTag
	function delTag(name) {
		setSearchState(prevState => ({ ...prevState, [name]: "" }))
	}
	// ? delTag

	// ! addTodoTask
	function addTodoTask() {
		setCookie(`dateForAddTodo=${getToday()}`)
		document.querySelector('.burger__btn').click()
		setTaskForAddTodo(searchState.task)
		setInputOfAddTodo(" ") // mandatory
	}
	// ? addTodoTask

	// ! searchReverse, toggleReverse
	const cookieSearchReverse = document.cookie.match(/searchReverse/) ? document.cookie.match(/searchReverse=\w+/)[0].replace(/searchReverse=/, '') : false
	const [searchReverse, setSearchReverse] = React.useState(eval(cookieSearchReverse))

	function toggleReverse() {
		setSearchReverse(prevState => !prevState)
	}

	React.useEffect(() => {
		setCookie(`searchReverse=${searchReverse}`)
	}, [searchReverse])

	searched = !searchReverse ? searched.reverse() : searched
	// ? searchReverse, toggleReverse

	// ! quantity
	if (!document.cookie.match(/quantity/)) {
		setCookie(`quantity=5`)
	}
	const cookieQuantity = document.cookie.match(/quantity=\d+/)[0].replace(/quantity=/, '') * 1
	const [quantity, setQuantity] = React.useState(cookieQuantity)
	function changeQuantity(event) {

		setPage(0)

		setQuantity(Number(event.target.value))
	}
	React.useEffect(() => {
		setCookie(`quantity=${quantity}`)
	}, [quantity])
	// ? quantity

	// ! page, pages, pageOptions, changePage
	if (!document.cookie.match(/page/)) {
		setCookie(`page=0`)
	}
	const cookiePage = document.cookie.match(/page=\d+/)[0].replace(/page=/, '') * 1
	const [page, setPage] = React.useState(cookiePage)
	const pages = Math.ceil(searched.length / quantity)

	const pageOptions = []
	for (let i = 0; i < pages; i++) {
		pageOptions.push(<option value={i}>{t[25]}: {i + 1}</option>)
	}

	function changePage(event) {
		setPage(Number(event.target.value))
	}
	// write page to cookie
	React.useEffect(() => {
		setCookie(`page=${page}`)
	}, [page])
	// ? page, pages, pageOptions, changePage

	// ! nextPage, prevPage
	function nextPage() {
		// prevent going to page that does not exist
		page !== pages - 1 && setPage(prevState => prevState + 1)
	}
	function prevPage() {
		page !== 0 && setPage(prevState => prevState - 1)
	}
	// ? nextPage, prevPage

	// ! hide arrows
	let arrowNext = document.querySelector('.arrow_search.arrow_next')
	if (page === pages - 1) {
		arrowNext && (arrowNext.style = "opacity:0.1")
	} else {
		arrowNext && (arrowNext.style = "opacity:1")
	}
	let arrowPrev = document.querySelector('.arrow_search.arrow_prev')
	if (page === 0) {
		arrowPrev && (arrowPrev.style = "opacity:0.1")
	} else {
		arrowPrev && (arrowPrev.style = "opacity:1")
	}
	// ? hide arrows

	// ! searchedMini
	const searchedMini = [[]]
	for (let i = 0, pages = 0, limit = 0; i < searched.length; i++) {
		searchedMini[pages].push(searched[i])
		limit++
		if (limit == quantity) {
			searchedMini.push([])
			limit = 0
			pages++
		}
	}
	// ? searchedMini

	// ! search NUMS
	let num1, num2

	num1 = quantity * page + 1
	num2 = quantity * page + quantity

	if (!searchReverse) {
		num1 = searched.length - (quantity * page)
		num2 = searched.length - (quantity * page + quantity - 1)
		num2 < 0 && (num2 = 1)
	}

	let searchedNum
	searchReverse ? (searchedNum = `1-${searched.length}`) : (searchedNum = `${searched.length}-1`)
	// ? search NUMS

	// ! other
	// watch if after action (done, doing, cancel, moveTask, etc) => nothing to display => go to prev page
	searchedMini[page].length === 0 && prevPage()



	// ! RETURN
	return (
		<>
			<div className="search">
				<div className="search__title">{t[14]}</div>
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
							{taskOptions.reverse()}
						</select>
						{searchState.task && <img className="add-todo-task" src={add} onClick={addTodoTask} />}
					</div>

					<div className="search-tags">
						{searched.length > 1 && <SearchTag text={searchedNum} titleTranslated={t[18]} showDel={false} toggleReverse={toggleReverse} />}
						{searchState.text && <SearchTag text={searchState.text} title="text" titleTranslated={t[15]} showDel={true} delTag={delTag} setPage={setPage} />}
						{searchState.status && <SearchTag text={searchState.optionText} title="status" titleTranslated={t[16]} showDel={true} delTag={delTag} setPage={setPage} />}
						{searchState.task && <SearchTag text={searchState.task} title="task" titleTranslated={t[17]} showDel={true} delTag={delTag} setPage={setPage} />}
					</div>

					{searched.length === 0 && searchCount > 0 && <SearchHint searchState={searchState} setSearchState={setSearchState} />}

					{searched.length > quantity &&
						<div className="search__pagination-wrap">

							<select
								name="quantity"
								value={quantity}
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
		</>
	)
}
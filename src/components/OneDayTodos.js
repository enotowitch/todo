import React from "react"
import Todo from "./../components/Todo"
import arrow from "./../img/arrow.svg"

export default function OneDayTodos({ todos, action, date, moveTodo }) {

	const thisDayTodos = []
	todos.map(elem => {
		return elem.date === date ? thisDayTodos.push(elem) : elem
	})

	let isLikedNum = 0
	thisDayTodos.map(elem => elem.isLiked && isLikedNum++)
	let isHiddenNum = 0
	thisDayTodos.map(elem => elem.isHidden && isHiddenNum++)
	let isDoneNum = 0
	thisDayTodos.map(elem => elem.isDone && isDoneNum++)
	let allTodosNum = thisDayTodos.length

	// ! intersections
	const isDoneIds = []
	thisDayTodos.map(elem => elem.isDone && isDoneIds.push(elem.id))
	const isLikedIds = []
	thisDayTodos.map(elem => elem.isLiked && isLikedIds.push(elem.id))
	const isHiddenIds = []
	thisDayTodos.map(elem => elem.isHidden && isHiddenIds.push(elem.id))

	const isDoneAndisHiddenIntersection = isDoneIds.filter(elem => isHiddenIds.includes(elem))
	const isLikedAndisHiddenIntersection = isLikedIds.filter(elem => isHiddenIds.includes(elem))
	// ? intersections

	const todoElems = thisDayTodos.map((elem, ind) => <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} />)
	const hiddenTodos = thisDayTodos.map((elem, ind) => {
		const newObj = { ...elem, isHidden: false }
		if (elem.isHidden) {
			return <Todo key={ind} {...newObj} action={action} moveTodo={moveTodo} />
		}
	})
	const likedTodos = thisDayTodos.map((elem, ind) => {
		if (elem.isLiked) {
			return <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} />
		}
	})
	const doneTodos = thisDayTodos.map((elem, ind) => {
		if (elem.isDone) {
			return <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} />
		}
	})
	function styleHiddenSection(e) {
		e.target.nextSibling.classList.toggle('hidden-todos')
		e.target.classList.toggle('turned-on')
	}
	function getTodoDate(event) {
		// write to cookie => on which day AddTodo() is used
		const dateForAddTodo = event.target.closest('.one-day-todos').querySelector('.date').innerText
		document.cookie = `dateForAddTodo=${dateForAddTodo}`
		// style
		document.querySelectorAll('.one-day-todos').forEach(elem => elem.classList.remove('chosen-day'))
		event.target.closest('.one-day-todos').classList.add('chosen-day')
		document.querySelector('.input__text').focus()
	}

	// ! allTodosWrapper
	const allTodosWrapper = <div className="all-todos-wrapper">

		{/* ! My Todos */}
		<div className="todos-wrapper">
			<p className="todos-title">My Todos
				<span className="todos-num">{allTodosNum - isHiddenNum}</span>
				{isHiddenNum > 0 && <span className="todos-num_hidden">{isHiddenNum}</span>}
			</p>
			{todoElems}
		</div>

		{/* ! Done Todos */}
		<div className="hidden-todos-wrapper">
			<p className="todos-title isDone" onClick={(e) =>
				styleHiddenSection(e)
			}>Done Todos
				<span className="todos-num todos-num_done">{isDoneNum}</span>
				{isDoneAndisHiddenIntersection.length > 0 && <span className="todos-num_hidden">{isDoneAndisHiddenIntersection.length}</span>}
			</p>
			<div className="hidden-todos">{doneTodos}</div>
		</div>

		{/* ! Liked Todos */}
		<div className="hidden-todos-wrapper">
			<p className="todos-title isLiked" onClick={(e) =>
				styleHiddenSection(e)
			}>Liked Todos
				<span className="todos-num todos-num_liked">{isLikedNum}</span>
				{isLikedAndisHiddenIntersection.length > 0 && <span className="todos-num_hidden">{isLikedAndisHiddenIntersection.length}</span>}
			</p>
			<div className="hidden-todos">{likedTodos}</div>
		</div>

		{/* ! Hidden Todos */}
		<div className="hidden-todos-wrapper">
			<p className="todos-title isHidden" onClick={(e) =>
				styleHiddenSection(e)
			}>Hidden Todos
				<span className="todos-num todos-num_hidden">{isHiddenNum}</span>
			</p>
			<div className="hidden-todos">{hiddenTodos}</div>
		</div>
	</div>
	// ? allTodosWrapper

	function toggleOneDayTodosView(event) {
		event.target.closest('.one-day-todos').classList.toggle('section-minimized')
	}

	const minifiedDate = date.slice(0, 3) + " " + date.match(/\d+/)

	return (
		// adding to this class each date of the year, so App can scroll to current date on load
		<div className={`one-day-todos ${minifiedDate.replace(/\s/, '')}`}>

			<div className="one-day-todos__top">
				<span className="date">{minifiedDate}</span>

				<button className="get-todo-date" onClick={getTodoDate}>+</button>

				<div className="one-day-todos-nums">
					{allTodosNum > 0 && <span className="todos-num">{allTodosNum}</span>}
					{isDoneNum > 0 && <span className="todos-num todos-num_done">{isDoneNum}</span>}
					{isLikedNum > 0 && <span className="todos-num todos-num_liked">{isLikedNum}</span>}
					{isHiddenNum > 0 && <span className="todos-num todos-num_hidden">{isHiddenNum}</span>}
				</div>

				{thisDayTodos.length > 0 && <img className="view-arrow" src={arrow} onClick={toggleOneDayTodosView} />}
			</div>

			{thisDayTodos.length > 0 && allTodosWrapper}

		</div>
	)
}
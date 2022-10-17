import React from "react"
import Todo from "./../components/Todo"
import arrow from "./../img/arrow.svg"
import getToday from "./../functions/getToday"
import normalizeDate from "./../functions/normalizeDate"
import AllActionNums from "./AllActionNums"
import plus from "./../img/plus.svg"

export default function OneDayTodos({ todos, action, date, moveTodo, setPopUpState, setShowPopUp }) {

	const thisDayTodos = []
	todos.map(elem => {
		return elem.date === date ? thisDayTodos.push(elem) : elem
	})

	// todo HAS DUP
	let isLikedNum = 0
	thisDayTodos.map(elem => elem.isLiked && isLikedNum++)
	let isHiddenNum = 0
	thisDayTodos.map(elem => elem.isHidden && isHiddenNum++)
	let isDoneNum = 0
	thisDayTodos.map(elem => elem.isDone && isDoneNum++)
	let allTodosNum = thisDayTodos.length


	// ALLTODOS: -isHidden, -isDone
	const todoElems = thisDayTodos.map((elem, ind) => (!elem.isHidden && !elem.isDone) && <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />)
	// DONETODOS: -isHidden
	const doneTodos = thisDayTodos.map((elem, ind) => (elem.isDone && !elem.isHidden) && <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />)
	const likedTodos = thisDayTodos.map((elem, ind) => elem.isLiked && <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />)
	const hiddenTodos = thisDayTodos.map((elem, ind) => elem.isHidden && <Todo key={ind} {...elem} action={action} moveTodo={moveTodo} setPopUpState={setPopUpState} setShowPopUp={setShowPopUp} />)

	function styleHiddenSection(e) {
		e.target.nextSibling.classList.toggle('hidden-todos')
		e.target.classList.toggle('turned-on')
	}
	function getTodoDate(event) {
		// write to cookie => on which day AddTodo() is used
		const dateForAddTodo = event.target.closest('.one-day-todos').querySelector('.date').innerText.replace(/\s/, '')
		document.cookie = `dateForAddTodo=${dateForAddTodo}`
		// turn on addTodo
		document.querySelector('.menu__btn').click()
		// style
		document.querySelectorAll('.one-day-todos').forEach(elem => elem.classList.remove('chosen-day'))
		event.target.closest('.one-day-todos').classList.add('chosen-day')
	}

	// ! allTodosWrapper
	const allTodosWrapper = <div className="all-todos-wrapper">

		{/* ! My Todos */}
		<div className="todos-wrapper">
			<p className="todos-title">My Todos
			</p>
			{todoElems}
		</div>

		{/* ! Done Todos */}
		<div className="hidden-todos-wrapper">
			<p className="todos-title isDone" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="done">Done&nbsp;&nbsp;</span>Todos
				{isDoneNum > 0 && <img className="action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{doneTodos}</div>
		</div>

		{/* ! Liked Todos */}
		<div className="hidden-todos-wrapper">
			<p className="todos-title isLiked" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="liked">Liked&nbsp;&nbsp;</span>Todos
				{isLikedNum > 0 && <img className="action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{likedTodos}</div>
		</div>

		{/* ! Hidden Todos */}
		<div className="hidden-todos-wrapper">
			<p className="todos-title isHidden" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="hidden">Hidden&nbsp;&nbsp;</span>Todos
				{isHiddenNum > 0 && <img className="action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{hiddenTodos}</div>
		</div>
	</div>
	// ? allTodosWrapper

	function toggleOneDayTodosView(event) {
		event.target.closest('.one-day-todos').classList.toggle('section-minimized')
	}

	return (
		// adding to this class each date of the year, so App can scroll to current date on load
		<div className={`one-day-todos ${date}`}>

			<div className="one-day-todos__top">
				<div>
					{date === getToday() && <div className="date_today">Today</div>}
					<div className="date">{normalizeDate(date)}</div>
				</div>

				<img className="get-todo-date" src={plus} onClick={getTodoDate} />

				<AllActionNums nums={{ allTodosNum, isDoneNum, isLikedNum, isHiddenNum }} />

				{thisDayTodos.length > 0 && <img className="view-arrow" src={arrow} onClick={toggleOneDayTodosView} />}
			</div>

			{thisDayTodos.length > 0 && allTodosWrapper}

		</div>
	)
}
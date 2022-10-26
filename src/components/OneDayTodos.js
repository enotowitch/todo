import React from "react"
import Todo from "./../components/Todo"
import arrow from "./../img/arrow.svg"
import getToday from "./../functions/getToday"
import normalizeDate from "./../functions/normalizeDate"
import AllActionNums from "./AllActionNums"
import add from "./../img/add.svg"

export default function OneDayTodos(props) {

	const thisDayTodos = []
	props.todos.map(elem => {
		return elem.date === props.date ? thisDayTodos.push(elem) : elem
	})

	// todo HAS DUP
	let isLikedNum = 0
	thisDayTodos.map(elem => elem.isLiked && isLikedNum++)
	let isHiddenNum = 0
	thisDayTodos.map(elem => elem.isHidden && isHiddenNum++)
	let isDoneNum = 0
	thisDayTodos.map(elem => elem.isDone && isDoneNum++)
	let allTodosNum = thisDayTodos.length

	function shortTodo(todo, ind) {
		return <Todo key={ind} {...todo} action={props.action} moveTodo={props.moveTodo} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} toggleAction={props.toggleAction} />
	}

	// ALLTODOS: -isHidden, -isDone
	const todoElems = thisDayTodos.map((todo, ind) => (!todo.isHidden && !todo.isDone) && shortTodo(todo, ind))
	// DONETODOS: -isHidden
	const doneTodos = thisDayTodos.map((todo, ind) => (todo.isDone && !todo.isHidden) && shortTodo(todo, ind))
	const likedTodos = thisDayTodos.map((todo, ind) => todo.isLiked && shortTodo(todo, ind))
	const hiddenTodos = thisDayTodos.map((todo, ind) => todo.isHidden && shortTodo(todo, ind))

	function styleHiddenSection(e) {
		e.target.nextSibling.classList.toggle('hidden-todos')
		e.target.classList.toggle('turned-on')
		let borderClassName = e.target.closest('.todos-wrapper').querySelector('.todos-title span').className
		borderClassName = "border" + borderClassName
		e.target.closest('.todos-wrapper').classList.toggle(borderClassName)
	}
	function getTodoDate(event) {
		// write to cookie => on which day AddTodo() is used
		const dateForAddTodo = event.target.closest('.one-day-todos').querySelector('.date').innerText.replace(/\s/, '')
		document.cookie = `dateForAddTodo=${dateForAddTodo}`
		// turn on addTodo
		document.querySelector('.burger__btn').click()
		// style
		document.querySelectorAll('.one-day-todos').forEach(elem => elem.classList.remove('chosen-day'))
		event.target.closest('.one-day-todos').classList.add('chosen-day')
	}

	// ! allTodosWrapper
	const allTodosWrapper = <div className="all-todos-wrapper">

		{/* ! My Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="all">My Todos</span>
				{allTodosNum - isDoneNum - isHiddenNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{todoElems}</div>
		</div>

		{/* ! Done Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="done">Done&nbsp;&nbsp;</span>Todos
				{isDoneNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{doneTodos}</div>
		</div>

		{/* ! Liked Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="liked">Liked&nbsp;&nbsp;</span>Todos
				{isLikedNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{likedTodos}</div>
		</div>

		{/* ! Hidden Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="hidden">Hidden&nbsp;&nbsp;</span>Todos
				{isHiddenNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{hiddenTodos}</div>
		</div>
	</div>
	// ? allTodosWrapper

	function toggleOneDayTodosView(event) {
		event.target.closest('.one-day-todos').classList.toggle('section-minimized')
		document.querySelectorAll('.one-day-todos').forEach(elem => elem.classList.remove('chosen-day'))
		event.target.closest('.one-day-todos').classList.add('chosen-day')
	}

	return (
		// adding to this class each date of the year, so App can scroll to current date on load
		<div className={`one-day-todos ${props.date} section-minimized`}>

			<div className="one-day-todos__top">
				<div>
					{props.date === getToday() && <div className="date_today">Today</div>}
					<div className="date">{normalizeDate(props.date)}</div>
				</div>

				<img className="get-todo-date" src={add} onClick={getTodoDate} />

				<AllActionNums nums={{ allTodosNum, isDoneNum, isLikedNum, isHiddenNum }} />

				{thisDayTodos.length > 0 && <img className="arrow view-arrow" src={arrow} onClick={toggleOneDayTodosView} />}
			</div>

			{thisDayTodos.length > 0 && allTodosWrapper}

		</div>
	)
}
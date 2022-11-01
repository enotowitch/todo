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
	let doingNum = 0
	thisDayTodos.map(elem => elem.doing && doingNum++)
	let canceledNum = 0
	thisDayTodos.map(elem => elem.canceled && canceledNum++)
	let doneNum = 0
	thisDayTodos.map(elem => elem.done && doneNum++)
	let allTodosNum = thisDayTodos.length

	function shortTodo(todo) {
		return <Todo key={todo.id} {...todo} action={props.action} moveTodo={props.moveTodo} moveTask={props.moveTask} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} toggleAction={props.toggleAction} />
	}

	// ! OUTPUT LOGIC
	// ALL aka TODO: -doing, -done, -canceled
	const todoElems = thisDayTodos.map((todo, ind) => (!todo.doing && !todo.done && !todo.canceled) && shortTodo(todo, ind))
	// DOING: +doing, -done, -canceled
	const doingTodos = thisDayTodos.map((todo, ind) => (todo.doing && !todo.done && !todo.canceled) && shortTodo(todo, ind))
	// DONE: +done, -canceled
	const doneTodos = thisDayTodos.map((todo, ind) => (todo.done && !todo.canceled) && shortTodo(todo, ind))
	// CANCELED: +canceled
	const canceledTodos = thisDayTodos.map((todo, ind) => todo.canceled && shortTodo(todo, ind))
	// ? OUTPUT LOGIC

	function styleHiddenSection(e) {
		e.target.nextSibling.classList.toggle('hidden-todos')
		e.target.classList.toggle('turned-on')
		// let borderClassName = e.target.closest('.todos-wrapper').querySelector('.todos-title span').className
		// borderClassName = "border" + borderClassName
		// e.target.closest('.todos-wrapper').classList.toggle(borderClassName)
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

		{/* ! All Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="all">Todo</span>
				{allTodosNum - doingNum - doneNum - canceledNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{todoElems}</div>
		</div>

		{/* ! Doing Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="doing">Doing&nbsp;&nbsp;</span>
				{doingNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{doingTodos}</div>
		</div>

		{/* ! Done Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="done">Done&nbsp;&nbsp;</span>
				{doneNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{doneTodos}</div>
		</div>

		{/* ! Canceled Todos */}
		<div className="todos-wrapper">
			<p className="todos-title" onClick={(e) =>
				styleHiddenSection(e)
			}><span className="canceled">Canceled&nbsp;&nbsp;</span>
				{canceledNum > 0 && <img className="arrow action-arrow" src={arrow} />}
			</p>
			<div className="hidden-todos">{canceledTodos}</div>
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

				<AllActionNums nums={{ allTodosNum, doneNum, doingNum, canceledNum }} />

				{thisDayTodos.length > 0 && <img className="arrow view-arrow" src={arrow} onClick={toggleOneDayTodosView} />}
			</div>

			{thisDayTodos.length > 0 && allTodosWrapper}

		</div>
	)
}
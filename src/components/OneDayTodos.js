import React from "react"
import Todo from "./../components/Todo"
import arrow from "./../img/arrow.svg"
import getToday from "./../functions/getToday"
import normalizeDate from "./../functions/normalizeDate"
import ActionNums from "./ActionNums"
import add from "./../img/add.svg"
import translate from '../functions/translate'
import TodoBlock from "./TodoBlock"

const t = translate()


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
	let allNum = thisDayTodos.length

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




	function toggleDay(event) {
		event.target.closest('.one-day-todos').classList.toggle('section-minimized')
		document.querySelectorAll('.one-day-todos').forEach(elem => elem.classList.remove('chosen-day'))
		event.target.closest('.one-day-todos').classList.add('chosen-day')
	}

	const [showBlock, setShowBlock] = React.useState({ allNum: false, doingNum: false, doneNum: false, canceledNum: false })
	function toggleBlock(blockName) {
		setShowBlock(prevState => ({ ...prevState, [blockName]: !showBlock[blockName] }))
	}

	return (
		// adding to this class each date of the year, so App can scroll to current date on load
		<div className={`one-day-todos ${props.date} section-minimized`}>

			<div className="one-day-todos__top">
				<div>
					{props.date === getToday() && <div className="date_today">{t[4]}</div>}
					<div className="date">{normalizeDate(props.date)}</div>
				</div>

				<img className="get-todo-date" src={add} onClick={getTodoDate} />

				<ActionNums allNum={(allNum - doingNum - doneNum - canceledNum)} doingNum={doingNum} doneNum={doneNum} canceledNum={canceledNum} />

				{thisDayTodos.length > 0 && <div className="toggle-day" onClick={toggleDay}><img className="arrow arrow_view arrow_day" src={arrow} /></div>}
			</div>

			{thisDayTodos.length > 0 &&
				<div className="all-todos-wrapper">
					<TodoBlock title={t[0]} num={allNum - doingNum - doneNum - canceledNum} cssClass="allNum" blockTodos={todoElems} showBlock={showBlock.allNum} toggleBlock={toggleBlock} />
					<TodoBlock title={t[1]} num={doingNum} cssClass="doingNum" blockTodos={doingTodos} showBlock={showBlock.doingNum} toggleBlock={toggleBlock} />
					<TodoBlock title={t[2]} num={doneNum} cssClass="doneNum" blockTodos={doneTodos} showBlock={showBlock.doneNum} toggleBlock={toggleBlock} />
					<TodoBlock title={t[3]} num={canceledNum} cssClass="canceledNum" blockTodos={canceledTodos} showBlock={showBlock.canceledNum} toggleBlock={toggleBlock} />
				</div>
			}

		</div>
	)
}
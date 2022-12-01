import React from "react"
import Todo from "./../components/Todo"
import arrow from "./../img/arrow.svg"
import getToday from "./../functions/getToday"
import ActionNums from "./ActionNums"
import add from "./../img/add.svg"
import translate from '../functions/Translate'
import TodoBlock from "./TodoBlock"
import { Context } from "../context"
import getCookie from "../functions/getCookie"


export default function OneDayTodos(props) {

	const { todos, yearForAddTodo, showDate, showTask } = React.useContext(Context)

	const t = translate()

	const thisDayTodos = []
	todos.map(todo => {
		return todo.date === props.date && todo.year == yearForAddTodo ? thisDayTodos.push(todo) : todo
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
		return <Todo key={todo.id} {...todo} showDate={showDate} showTask={showTask} dateTranslated={props.dateTranslated} action={props.action} moveTodo={props.moveTodo} moveTask={props.moveTask} setPopUpState={props.setPopUpState} setShowPopUp={props.setShowPopUp} toggleAction={props.toggleAction} />
	}

	// ! OUTPUT LOGIC
	// ALL aka TODO: -doing, -done, -canceled
	let allTodos = thisDayTodos.map((todo, ind) => (!todo.doing && !todo.done && !todo.canceled) && shortTodo(todo, ind))
	// DOING: +doing, -done, -canceled
	let doingTodos = thisDayTodos.map((todo, ind) => todo.doing && shortTodo(todo, ind))
	// DONE: +done, -canceled
	let doneTodos = thisDayTodos.map((todo, ind) => todo.done && shortTodo(todo, ind))
	// CANCELED: +canceled
	let canceledTodos = thisDayTodos.map((todo, ind) => todo.canceled && shortTodo(todo, ind))
	// ? OUTPUT LOGIC
	// filter todos from false values
	allTodos = allTodos.filter(isTrue => isTrue)
	doingTodos = doingTodos.filter(isTrue => isTrue)
	doneTodos = doneTodos.filter(isTrue => isTrue)
	canceledTodos = canceledTodos.filter(isTrue => isTrue)

	function getTodoDate(event) {
		// write to cookie => on which day AddTodo() is used
		document.cookie = `dateForAddTodo=${props.date}`
		document.cookie = `dateTranslated=${props.dateTranslated}`
		// turn on addTodo
		document.querySelector('.burger__btn').click()
	}

	function toggleDay(event) {
		event.target.closest('.one-day-todos').classList.toggle('section-minimized')
	}

	const [showBlock, setShowBlock] = React.useState({ allNum: false, doingNum: false, doneNum: false, canceledNum: false })
	function toggleBlock(blockName) {
		setShowBlock(prevState => ({ ...prevState, [blockName]: !showBlock[blockName] }))
	}

	// ! chosen-day
	React.useEffect(() => {
		// style chosen-day on click inside
		document.querySelectorAll('.one-day-todos').forEach(function (elem) {
			elem.addEventListener('click', function (event) {
				document.querySelectorAll('.one-day-todos').forEach(function (elem) {
					elem.classList.remove('chosen-day')
				})
				event.target.closest('.one-day-todos').classList.add('chosen-day')
			})
		})
	}, [])

	React.useEffect(() => {
		// style chosen-day when toggle week/addTodo
		const dateChosen = getCookie("dateForAddTodo").replace(/\s/, '')
		setTimeout(() => {
			document.querySelectorAll('.one-day-todos').forEach(elem => elem.classList.remove('chosen-day'))
			document.querySelector(`.${dateChosen}`).classList.add('chosen-day')
		}, 1);
	}, [])
	// ? chosen-day

	// ! return
	return (
		// adding to this class each date of the year, so App can scroll to current date on load
		<div className={`one-day-todos ${props.date.replace(/\s/, '')} section-minimized`}>

			<div onClick={toggleDay}>
				<Todo id={0} date={props.date} year={yearForAddTodo} cssClass="fake-todo" />
			</div>

			<div className="one-day-todos__top">
				<div>
					{props.date === getToday() && <div className="date_today">{t[4]}</div>}
					<div className="date">{props.dateTranslated}</div>
				</div>

				<img className="get-todo-date" src={add} onClick={getTodoDate} />

				<ActionNums allNum={(allNum - doingNum - doneNum - canceledNum)} doingNum={doingNum} doneNum={doneNum} canceledNum={canceledNum} />

				{thisDayTodos.length > 0 && <div className="toggle-day"><img className="arrow arrow_view arrow_day" src={arrow} /></div>}
			</div>

			{thisDayTodos.length > 0 &&
				<div className="all-todos-wrapper">
					<TodoBlock title={t[0]} date={props.date} num={allNum - doingNum - doneNum - canceledNum} cssClass="allNum" blockTodos={allTodos} showBlock={showBlock.allNum} toggleBlock={toggleBlock} />
					<TodoBlock title={t[1]} date={props.date} num={doingNum} cssClass="doingNum" blockTodos={doingTodos} showBlock={showBlock.doingNum} toggleBlock={toggleBlock} />
					<TodoBlock title={t[2]} date={props.date} num={doneNum} cssClass="doneNum" blockTodos={doneTodos} showBlock={showBlock.doneNum} toggleBlock={toggleBlock} />
					<TodoBlock title={t[3]} date={props.date} num={canceledNum} cssClass="canceledNum" blockTodos={canceledTodos} showBlock={showBlock.canceledNum} toggleBlock={toggleBlock} />
				</div>
			}

		</div>
	)
}
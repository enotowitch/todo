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
import setCookie from "../functions/setCookie"


export default function OneDayTodos(props) {

	const { todos, yearForAddTodo } = React.useContext(Context)

	const t = translate()

	const thisDayTodos = []
	todos.map(todo => {
		return todo.date === props.date && todo.year == yearForAddTodo ? thisDayTodos.push(todo) : todo
	})

	let doingNum = 0
	thisDayTodos.map(elem => elem.doing && doingNum++)
	let canceledNum = 0
	thisDayTodos.map(elem => elem.canceled && canceledNum++)
	let doneNum = 0
	thisDayTodos.map(elem => elem.done && doneNum++)
	let allNum = thisDayTodos.length

	function shortTodo(todo) {
		return <Todo key={todo.id} {...todo} dateTranslated={props.dateTranslated} />
	}

	// ! OUTPUT LOGIC
	// ALL aka TODO: -doing, -done, -canceled
	let allTodos = thisDayTodos.map((todo, ind) => (!todo.doing && !todo.done && !todo.canceled) && shortTodo(todo, ind)).filter(isTrue => isTrue)
	// DOING: +doing, -done, -canceled
	let doingTodos = thisDayTodos.map((todo, ind) => todo.doing && shortTodo(todo, ind)).filter(isTrue => isTrue)
	// DONE: +done, -canceled
	let doneTodos = thisDayTodos.map((todo, ind) => todo.done && shortTodo(todo, ind)).filter(isTrue => isTrue)
	// CANCELED: +canceled
	let canceledTodos = thisDayTodos.map((todo, ind) => todo.canceled && shortTodo(todo, ind)).filter(isTrue => isTrue)
	// ? OUTPUT LOGIC

	function getTodoDate() {
		// write to cookie => on which day AddTodo() is used
		setCookie(`dateForAddTodo=${props.date}`)
		setCookie(`dateTranslated=${props.dateTranslated}`)
		// turn on addTodo
		document.querySelector('.burger__btn').click()
	}

	function toggleDay(event) {
		event.target.closest('.one-day-todos').classList.toggle('section-minimized')
	}

	// x4 true = perfomance loss, usability gain
	const [showBlock, setShowBlock] = React.useState({ allNum: true, doingNum: true, doneNum: true, canceledNum: true })
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
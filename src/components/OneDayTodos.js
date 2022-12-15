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
import dateTranslate from "../functions/dateTranslate"


export default function OneDayTodos(props) {

	const { todos, yearForAddTodo, lang } = React.useContext(Context)

	const dateTranslated = dateTranslate(props.date, lang)

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
		return <Todo key={todo.id} {...todo} />
	}

	// ! OUTPUT LOGIC
	// ALL aka TODO: -doing, -done, -canceled
	let allTodos = thisDayTodos.map((todo) => (!todo.doing && !todo.done && !todo.canceled) && shortTodo(todo)).filter(isTrue => isTrue)
	// DOING: +doing, -done, -canceled
	let doingTodos = thisDayTodos.map((todo) => todo.doing && shortTodo(todo)).filter(isTrue => isTrue)
	// DONE: +done, -canceled
	let doneTodos = thisDayTodos.map((todo) => todo.done && shortTodo(todo)).filter(isTrue => isTrue)
	// CANCELED: +canceled
	let canceledTodos = thisDayTodos.map((todo) => todo.canceled && shortTodo(todo)).filter(isTrue => isTrue)
	// ? OUTPUT LOGIC

	function getTodoDate() {
		// write to cookie => on which day AddTodo() is used
		setCookie(`dateForAddTodo=${props.date}`)
		setCookie(`dateTranslated=${dateTranslated}`)
		// turn on addTodo
		document.querySelector('.burger__btn').click()
	}

	const [showDay, setShowDay] = React.useState({ [props.date]: false })
	function toggleDay(event) {
		setShowDay(prevState => ({ [props.date]: !prevState[props.date] }))
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
	// ! weekDay
	const weekDay = new Date(`${props.date}, ${yearForAddTodo}`).toLocaleTimeString(lang, { weekday: 'short' }).match(/.*?\s/)[0]


	
	// ! RETURN
	return (
		<div className={`one-day-todos ${props.date.replace(/\s/, '')} section-minimized`}>

			<div onClick={toggleDay}>
				<Todo id={0} date={props.date} cssClass="fake-todo" />
			</div>

			<div className="one-day-todos__top">
				<img className="get-todo-date" src={add} onClick={getTodoDate} />
				<div>
					<div className="date_today">{props.date === getToday() ? t[4] : weekDay}</div>
					<div className="date">{dateTranslated}</div>
				</div>


				<ActionNums allNum={(allNum - doingNum - doneNum - canceledNum)} doingNum={doingNum} doneNum={doneNum} canceledNum={canceledNum} />

				{thisDayTodos.length > 0 && <div className="toggle-day"><img className="arrow arrow_view arrow_day" src={arrow} /></div>}
			</div>

			{thisDayTodos.length > 0 && showDay[props.date] &&
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
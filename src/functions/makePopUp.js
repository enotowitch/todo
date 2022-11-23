export default function makePopUp({ imgName, title, text, setPopUpState, setShowPopUp, modalWindowType, doFunction, todoId }) {
	setShowPopUp(false)
	setPopUpState({ imgName, title, text, modalWindowType, doFunction, todoId })
	setTimeout(() => {
		setShowPopUp(true)
	}, 100);
}
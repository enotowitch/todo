export default function makePopUp({ imgName, title, text, setPopUpState, setShowPopUp, modalWindowType, doFunction, todoId, showTask }) {
	setShowPopUp(false)
	setPopUpState({ imgName, title, text, modalWindowType, doFunction, todoId, showTask })
	setTimeout(() => {
		setShowPopUp(true)
	}, 100);
}
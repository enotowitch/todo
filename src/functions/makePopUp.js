export default function makePopUp({ imgName, title, text, setPopUpState, setShowPopUp, modalWindowType, doFunction, todoId }) {
	setShowPopUp(false)
	setPopUpState({ imgName: imgName, title: title, text: text, modalWindowType, doFunction, todoId })
	setTimeout(() => {
		setShowPopUp(true)
	}, 100);
}
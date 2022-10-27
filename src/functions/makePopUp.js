export default function makePopUp({ imgName, title, text, setPopUpState, setShowPopUp, modalWindowType, doFunction, todoId }) {
	setPopUpState({ imgName: imgName, title: title, text: text, modalWindowType, doFunction, todoId })
	setShowPopUp(true)
}
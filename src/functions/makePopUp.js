export default function makePopUp(imgName, title, text, setPopUpState, setShowPopUp, modalWindowType, doFunction) {
	setPopUpState({ imgName: imgName, title: title, text: text, modalWindowType, doFunction })
	setShowPopUp(true)
}
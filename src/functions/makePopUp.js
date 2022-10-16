export default function makePopUp(imgName, title, text, setPopUpState, setShowPopUp, modalWindowType) {
	setPopUpState({ imgName: imgName, title: title, text: text, modalWindowType })
	setShowPopUp(true)
}
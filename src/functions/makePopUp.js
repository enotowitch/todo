export default function makePopUp(imgName, title, text, setPopUpState, setShowPopUp) {
	setPopUpState({ imgName: imgName, title: title, text: text })
	setShowPopUp(true)
}
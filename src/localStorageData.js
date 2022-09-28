import makeObj from "./functions/makeObj"

// ! preparing localStorage
const arrOfObjects = []
Object.keys(localStorage).map(elem => arrOfObjects.push(makeObj(localStorage.getItem(elem))))

// todo learn sort
function compare(a, b) {
	if (a.text < b.text) {
		return -1;
	}
	if (a.text > b.text) {
		return 1;
	}
	return 0;
}

arrOfObjects.sort(compare);

export default arrOfObjects
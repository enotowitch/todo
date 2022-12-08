// ! preparing localStorage
const arrOfObjects = []
Object.keys(localStorage).map(elem => arrOfObjects.push(JSON.parse(localStorage.getItem(elem))))

function compare(a, b) {
	if (a.id < b.id) {
		return -1;
	}
	if (a.id > b.id) {
		return 1;
	}
	return 0;
}

arrOfObjects.sort(compare);

export default arrOfObjects
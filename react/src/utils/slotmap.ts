export function getMap() {
	const map = localStorage.getItem("map");
	if (map) return JSON.parse(map);
	return null;
}

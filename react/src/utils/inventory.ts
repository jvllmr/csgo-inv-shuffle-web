export function getInv() {
	const inv = localStorage.getItem("inv");
	if (inv) return JSON.parse(inv);
	return [];
}

export function setInv(inventory: any) {
	localStorage.setItem("inv", JSON.stringify(inventory));
}

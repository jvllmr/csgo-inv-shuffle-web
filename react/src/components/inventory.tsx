import React, { useEffect, useState } from "react";
import { getUserID } from "../utils/auth";

export default function Inventory() {
	const [inventory, setInventory] = useState();
	useEffect(() => {
		fetch(
			`https://steamcommunity.com/profiles/${getUserID()}/inventory/json/730/2`
		);
	}, []);

	return <></>;
}

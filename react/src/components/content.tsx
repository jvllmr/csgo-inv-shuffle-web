import React from "react";
import Container from "react-bootstrap/Container";
import Inventory from "./inventory";

export default class Content extends React.Component {
	state = {
		slotcount: 0,
	};

	render() {
		return (
			<Container className="content">
				<Inventory />

				<Container className="inventory"></Container>
			</Container>
		);
	}
}

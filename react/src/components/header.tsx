import React from "react";
import User from "./user";

class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<div className="t-icon">
					<img src="./img/terrorist.png" alt="T Side"></img>
				</div>
				<div className="ct-icon">
					<img src="./img/ct.png" alt="CT Side"></img>
				</div>
				<User />
			</div>
		);
	}
}

export default Header;

import React from "react";

import User from "./user";

class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<div className="howto">
					<a href="/howto">
						<b style={{ color: "white" }}>How it works</b>
					</a>
				</div>
				<User />
			</div>
		);
	}
}

export default Header;

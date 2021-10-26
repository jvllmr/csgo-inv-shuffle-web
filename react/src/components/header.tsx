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
		  <div className="icons">
				<div className="t-icon">
					<img src="./img/terrorist.png" alt="T Side"></img>
				</div>
				<div className="ct-icon">
					<img src="./img/ct.png" alt="CT Side"></img>
				</div>
				</div>
				
			</div>
		);
	}
}

export default Header;

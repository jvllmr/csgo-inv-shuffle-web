import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";

import User from "./user";

interface HeaderProps {
	mainPage?: boolean
}

function Header(props: HeaderProps) {
	
		return (
			<Navbar className="header" fixed="top" variant="dark">
				
					<Navbar.Brand href="/"><img style={{maxHeight: 48, maxWidth:48, marginLeft: 20}} src="/img/brand.png" alt="CSGOINVSHUFFLE"/></Navbar.Brand>
					<Navbar.Toggle aria-controls="responsive-navbar-nav" />
					<Navbar.Collapse id="responsive-navbar-nav">
					
						<Nav className="me-auto">
						<Container>
							<Nav.Link href="/howto">How it works</Nav.Link>
							</Container>
						</Nav>
						
						
						<Nav><Container><User /></Container></Nav>
						
					</Navbar.Collapse>
				
			</Navbar>
		);
	
}

export default Header;

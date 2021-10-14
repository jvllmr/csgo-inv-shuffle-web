import React from 'react'
import { Nav } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'

class Header extends React.Component {
    render() {
        return (
            <>
            <Navbar className="header" fixed="top">
                <img src="./img/terrorist.png" alt="T Side"></img>
                <img src="./img/ct.png" alt="CT Side"></img>
            </Navbar>
            <a><img alt="Steam Login"></img></a>
            </>
        )
    }


}

export default Header
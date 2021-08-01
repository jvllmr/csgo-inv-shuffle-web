import React from 'react'
import '../css/header.css'

class Header extends React.Component {
    render() {
        return (
            < React.StrictMode>
            <header>
            <div className="header">
                <img src="./img/icon-t.png" alt="T Side"></img>
                <img src="./img/icon-ct.webp" alt="CT Side"></img>
            </div>
            </header>
            </React.StrictMode>
        )
    }


}

export default Header
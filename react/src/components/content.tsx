import React from 'react'
import Container from 'react-bootstrap/Container'



class Content extends React.Component {
    state = {
        slotcount: 0,
        
    }

    render() {
        return (
            <Container className="content">
                <Container className="slotmap">

                </Container>

                <Container className="inventory">
                    
                </Container>

            </Container>
        )
    }
}
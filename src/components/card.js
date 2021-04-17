import React from 'react'
import { Card } from 'react-bootstrap'

const card = (img, i) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={img} fluid/>
            <Card.Body>
                <Card.Title>Card Title {i}</Card.Title>
            </Card.Body>
        </Card>
    )
}

export default card;

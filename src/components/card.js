import React from 'react'
import { Card } from 'react-bootstrap'

const card = ({image, name}, i) => {
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Img variant="top" src={image}/>
            <Card.Body>
                <Card.Title>{name}</Card.Title>
            </Card.Body>
        </Card>
    )
}

export default card;

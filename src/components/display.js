import React from 'react'
import card from './card'
import { Container, Row, Col } from 'react-bootstrap'

const display = (images) => {
    const eles = images.map((v, i) => {
        return <Row key={i}><Col className="d-flex justify-content-center">{card(v, i)}</Col></Row>;
    });
    return <Container fluid>
        {eles}
    </Container>
}

export default display;

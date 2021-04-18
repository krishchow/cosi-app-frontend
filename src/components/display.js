import React from 'react'
import card from './card'
import { Container, Row, Col } from 'react-bootstrap'

const display = (images) => {
    const eles = images.map((v, i) => {
        return <Col className="d-flex justify-content-center" key={i}>{card(v, i)}</Col>;
    });
    return <Container fluid>
        <Row>
            {eles}
        </Row>
    </Container>
}

export default display;

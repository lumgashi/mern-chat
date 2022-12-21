import React from 'react'
import { Row, Col, Button, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import '../styles/Homepage.css'

const Homepage = () => {
   return (
      <Container fluid>
         <Row>
            <Col md={5} className="d-flex flex-direction-column align-items-center
         justify-content-center" style={{ backgroundColor: "#E1EEFA" }}>
               <section className='section__info'>
                  <h1>Share the world with your friends</h1>
                  <p>Chat app lets you connect with the world</p>
                  <LinkContainer to='/chat'>
                     <Button>Get Started<i className='fas fa-comments home-message-icon '></i></Button>
                  </LinkContainer>
               </section>
            </Col>

            <Col md={7} className="home__bg">

            </Col>
         </Row>
      </Container>
   )
}

export default Homepage
import React, { useState, useContext } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom'
import '../styles/Login.css'
import { useLoginUserMutation } from '../services/appApi'
import { AppContext } from '../context/appContext';

const Login = () => {

   const [email, setEmail] = useState();
   const [password, setPassword] = useState();
   const [loginUser, { isLoading, error }] = useLoginUserMutation()
   const navigate = useNavigate()
   const { socket } = useContext(AppContext)

   function handleLogin(e) {
      e.preventDefault();
      // login logic
      loginUser({ email, password }).then(({ data }) => {
         if (data) {
            // socket work
            socket.emit("new-user");
            // navigate to the chat
            navigate("/chat");
         }
      });
   }
   return (
      <Container fluid>
         <Row>
            <Col md={7} className='login__bg'></Col>
            <Col md={5} className="d-flex flex-direction-column align-items-center
         justify-content-center flex-direction-column">
               <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={handleLogin} >
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                     <Form.Label>Email address</Form.Label>
                     <Form.Control type="email" placeholder="Enter email" required onChange={(e) =>
                        setEmail(e.target.value)} value={email} />
                     <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                     </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                     <Form.Label>Password</Form.Label>
                     <Form.Control type="password" placeholder="Password" required onChange={(e) =>
                        setPassword(e.target.value)} value={password} />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                     Login
                  </Button>
                  <div className='py-4'>
                     <p className='text-center'>Dont have an account?<Link to='/signup'>Signup</Link> </p>
                  </div>
               </Form>
            </Col>
         </Row>
      </Container >
   );
}

export default Login
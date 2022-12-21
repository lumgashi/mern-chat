import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import logo from './logo.png'
import { useLogoutUserMutation } from '../services/appApi'
import { useNavigate } from 'react-router-dom';

function Navigation() {

   const user = useSelector(state => state.user)
   const [logoutUser] = useLogoutUserMutation()
   const navigate = useNavigate()



   const handleLogout = async (e) => {
      e.preventDefault();
      await logoutUser(user);
      //redirect to homepage
      navigate('/')
   }

   return (
      <Navbar bg="light" expand="lg">
         <Container>
            <Navbar.Brand href="/">
               <img src={logo} style={{ width: 50, height: 30 }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="ms-auto">
                  {!user && (<LinkContainer to="/login">
                     <Nav.Link>Login</Nav.Link>
                  </LinkContainer>)}
                  <LinkContainer to="/chat">
                     <Nav.Link>Chat</Nav.Link>
                  </LinkContainer>
                  {user && (
                     <NavDropdown
                        title={
                           <>
                              <img src={user.picture} style={{
                                 width: 30, height: 30, marginRight: 10,
                                 objectFit: 'cover', borderRadius: '50%'
                              }} />
                              {user.name}
                           </>
                        }
                        id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">
                           Another action
                        </NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Item>
                           <Button onClick={handleLogout}>Logout</Button>
                        </NavDropdown.Item>
                     </NavDropdown>)}
               </Nav>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}

export default Navigation;
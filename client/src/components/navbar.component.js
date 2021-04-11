import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import authService from '../services/auth.service'

class NavBar extends React.Component {

     logout = () => {
          authService.logout()
          this.props.history.push('/login')
          window.location.reload()
     }

     render() {
          if (this.props.user) {
               return (
                    <Navbar bg="light" expand="lg">
                         <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="mr-auto">
                                   <Nav.Link href="/">Home</Nav.Link>
                                   {!this.props.isStreaming ? (
                                        <a href="/broadcaster" className="btn btn-outline-success" role="button" aria-disabled="true">Start streaming</a>
                                   ) : (
                                        ''
                                   )}
                              </Nav>
                              <Nav>
                                   <NavDropdown title={this.props.user.name} id="basic-nav-dropdown">
                                        <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                        <NavDropdown.Item onClick={this.logout}>Logout</NavDropdown.Item>
                                   </NavDropdown>
                              </Nav>
                         </Navbar.Collapse>
                    </Navbar>
               );
          }
          else {

          }
     }
}

export default NavBar
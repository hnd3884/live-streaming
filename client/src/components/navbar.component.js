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
                                        <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><a style={{color:'#28a745'}} href="/broadcaster">Start Streaming</a></button>
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
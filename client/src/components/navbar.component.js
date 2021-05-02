import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import authService from '../services/auth.service'

class NavBar extends React.Component {

     constructor(props){
          super();
          this.state = {
               isPrivate : false
          }
     }

     logout = () => {
          authService.logout()
          this.props.history.push('/login')
          window.location.reload()
     }

     handleSwitch = (event) => {
          // console.log(event.target.checked)
          this.setState({
               isPrivate : event.target.checked
          })
     }

     render() {
          if (this.props.user) {
               return (
                    <Navbar bg="light" expand="lg">
                         <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="mr-auto">
                                   <Nav.Link href="/">Home</Nav.Link>
                                   {!this.props.isStreaming ? (
                                        <>
                                             <a href={this.state.isPrivate ? '/broadcaster/private' : '/broadcaster/public'} className="btn btn-outline-primary" role="button" aria-disabled="true">Start streaming</a>
                                             <div className="custom-control custom-switch">
                                                  <input type="checkbox" className="custom-control-input" onChange={this.handleSwitch} id="customSwitch1" />
                                                  <label className="custom-control-label" htmlFor="customSwitch1">Private room</label>
                                             </div>
                                        </>
                                   ) : (
                                        <>
                                             Password: {this.props.password}
                                        </>
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
               return (
                    <Navbar bg="light" expand="lg">
                         <Navbar.Collapse id="basic-navbar-nav">
                              <Nav className="mr-auto">
                                   <Nav.Link href="/">Home</Nav.Link>
                                   <a href="/login" className="btn btn-outline-primary" role="button" aria-disabled="true">Login to stream and interact</a>
                              </Nav>
                              <Nav>
                                   <Nav.Link>You are logging as anonymous</Nav.Link>
                              </Nav>
                         </Navbar.Collapse>
                    </Navbar>
               );
          }
     }
}

export default NavBar
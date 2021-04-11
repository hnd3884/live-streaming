import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Form, Button } from "react-bootstrap";
import authService from '../services/auth.service'

class Login extends React.Component {
     constructor(props) {
          super(props)

          // check user signed in
          let user = authService.getCurrentUser();
          if (user) {
               this.props.history.push('/')
          }

          this.state = {}
     }

     loginButtonHandler = async (event) => {
          event.preventDefault();

          this.setState({
               username_validate_err: '',
               password_validate_err: '',
          })

          let username = document.getElementById('username').value
          let password = document.getElementById('password').value

          let validate = true

          if (username.length < 7) {
               validate = false
               this.setState({
                    username_validate_err: 'Username have to be more 7 characters',
               })
          }

          if (password.length < 7) {
               validate = false
               this.setState({
                    password_validate_err: 'Password have to be more 7 characters',
               })
          }

          if (validate) {
               let res = await authService.login(username, password)
               if (!res) {
                    this.props.history.push('/')
                    window.location.reload()
               }
               else {
                    this.setState({
                         server_err: res,
                    })
               }
          }
     }

     render() {
          return (
               <div style={{ margin: '100px' }}>
                    <Form style={{ width: '50%', height: '400px' }}>
                         <Form.Text className="text-danger">
                              {this.state.server_err ? this.state.server_err : ''}
                         </Form.Text>
                         <Form.Group>
                              <Form.Label about='username'>Username</Form.Label>
                              <Form.Control type="text" placeholder="Enter username" id="username" autoComplete='on' />
                              <Form.Text className="text-danger">
                                   {this.state.username_validate_err}
                              </Form.Text>
                         </Form.Group>

                         <Form.Group>
                              <Form.Label about='password'>Password</Form.Label>
                              <Form.Control type="password" placeholder="Password" id="password" autoComplete='on' />
                              <Form.Text className="text-danger">
                                   {this.state.password_validate_err}
                              </Form.Text>
                         </Form.Group>

                         <Form.Group>
                              <Form.Check type="checkbox" label="Check me out" />
                         </Form.Group>
                         <Button variant="primary" type="submit" onClick={this.loginButtonHandler}>
                              Submit
                    </Button>
                    </Form>
               </div>
          );
     }
}

export default Login
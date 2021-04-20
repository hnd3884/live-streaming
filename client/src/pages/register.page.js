import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Form, Button } from "react-bootstrap";
import authService from '../services/auth.service'

class Register extends React.Component {
     constructor(props) {
          super(props)

          // check user signed in
          // let user = authService.getCurrentUser();
          // if (user) {
          //      this.props.history.push('/')
          // }

          this.state = {
               gender: '',
               username_validate_err: '',
               password_validate_err: '',
          }
     }

     RegisterButtonHandler = async (event) => {
          event.preventDefault();

          let username = document.getElementById('username').value
          let password = document.getElementById('password').value
          let name = document.getElementById('name').value
          let email = document.getElementById('email').value

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
               let res = await authService.register(username, email, password, name)
               console.log(res)
               if (res.status === 200) {
                    this.props.history.push('/login')
                    window.location.reload()
               }
               else {
                    this.setState({
                         server_err: res,
                    })
               }
          }
     }

     onChangeGender = (event) => {
          // console.log(event.target.value);
          this.setState({
               gender: event.target.value
          })
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
                              <Form.Label about='name'>Name</Form.Label>
                              <Form.Control type="text" placeholder="Name" id="name" autoComplete='on' />
                              <Form.Text className="text-danger">
                                   {this.state.password_validate_err}
                              </Form.Text>
                         </Form.Group>

                         <Form.Group onChange={this.onChangeGender}>
                              <Form.Label about='gender'>Gender</Form.Label>
                              <Form.Check
                                   custom
                                   type='radio'
                                   label='Male'
                                   id='male'
                                   name='gender'
                                   value='male'
                              />
                              <Form.Check
                                   custom
                                   type='radio'
                                   label='Female'
                                   id='female'
                                   name='gender'
                                   value='female'
                              />
                         </Form.Group>

                         <Form.Group>
                              <Form.Label about='email'>Email</Form.Label>
                              <Form.Control type="email" placeholder="Email" id="email" autoComplete='on' />
                              <Form.Text className="text-danger">
                                   {this.state.password_validate_err}
                              </Form.Text>
                         </Form.Group>

                         <Button variant="primary" type="submit" onClick={this.RegisterButtonHandler}>
                              Register
                         </Button>
                         &nbsp;&nbsp;
                         <a href='/login'>Login</a>
                    </Form>
               </div>
          );
     }
}

export default Register
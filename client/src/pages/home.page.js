import React from "react";
import './styles/home.style.css'
import './styles/common.style.css'
import "bootstrap/dist/css/bootstrap.min.css";
import authService from '../services/auth.service'
import configs from '../config'
import axios from 'axios'
import NavBar from "../components/navbar.component";
import { Button, Modal } from "react-bootstrap";

class Home extends React.Component {

     constructor(props) {
          super(props)

          // check if user did not sign in
          let user = authService.getCurrentUser();
          if (!user) {
               this.state = {
                    broadcasters: {},
                    user: null,
                    isPrivate: false,
                    show: false,
                    userPrivate: ''
               }
          }
          else {
               this.state = {
                    broadcasters: {},
                    user: JSON.parse(user),
                    isPrivate: false,
                    show: false,
                    userPrivate: ''
               }
          }
     }

     handleClose = () => {
          this.setState({
               show: false
          })
     }

     handleSubmit = () => {
          let password = document.getElementById('password').value
          axios.post(`${configs.API_URL}/room/`, {
               user: this.state.userPrivate,
               password: password
          })
               .then(res => {
                    if (res.data.error) {
                         alert(res.data.error)
                         return
                    }
                    this.props.history.push('/watch/' + res.data)
                    window.location.reload()
               })
     }

     handleShow = (mode, username) => {
          if (mode === 'public') {
               axios.post(`${configs.API_URL}/room/`, {
                    user: username,
                    password: null
               })
                    .then(res => {
                         this.props.history.push('/watch/' + res.data)
                         window.location.reload()
                    })
          }
          else {
               this.setState({
                    show: true,
                    userPrivate: username
               })
          }
     }

     componentDidMount() {
          this.GetBroadcasters()
     }

     GetBroadcasters = () => {
          axios.get(`${configs.API_URL}/broadcaster/list`)
               .then(res => {
                    this.setState({
                         broadcasters: res.data
                    })
               })
     }



     render() {
          return (
               <div>
                    <NavBar user={this.state.user} history={this.props.history} handleSwitch={this.handleSwitch} isStreaming={false} />
                    <table className="table">
                         <thead className="bg-primary text-light">
                              <tr>
                                   <th scope="col"><h1>On Stream</h1></th>
                              </tr>
                         </thead>
                         <tbody>
                              {Object.keys(this.state.broadcasters).length === 0 ? <tr><td>No streamer online</td></tr> : (
                                   Object.keys(this.state.broadcasters).map((key, i) => {
                                        if (this.state.broadcasters[key].mode === 'private') {
                                             return (
                                                  <tr key={i}><td>
                                                       <Button variant="link" onClick={() => { this.handleShow('private', this.state.broadcasters[key].name) }}>
                                                            {this.state.broadcasters[key].name}
                                                       &nbsp;
                                                       <span className="badge badge-danger">private</span>
                                                       </Button>
                                                  </td></tr>


                                             )
                                        }
                                        else {
                                             return (
                                                  <tr key={i}><td>
                                                       <Button variant="link" onClick={() => { this.handleShow('public', this.state.broadcasters[key].name) }}>
                                                            {this.state.broadcasters[key].name}
                                                       &nbsp;
                                                       <span className="badge badge-success">public</span>
                                                       </Button>
                                                  </td></tr>
                                             )
                                        }
                                   }
                                   )
                              )}
                         </tbody>
                    </table>

                    <Modal show={this.state.show} onHide={this.handleClose}>
                         <Modal.Header closeButton>
                              <Modal.Title>Room authentication</Modal.Title>
                         </Modal.Header>
                         <Modal.Body>
                              <div>Enter password</div>
                              <input id='password' type='text' />
                         </Modal.Body>
                         <Modal.Footer>
                              <Button variant="secondary" onClick={this.handleClose}>
                                   Close
                              </Button>
                              <Button variant="primary" onClick={this.handleSubmit}>
                                   Submit
                              </Button>
                         </Modal.Footer>
                    </Modal>
               </div>
          )
     }
}

export default Home;
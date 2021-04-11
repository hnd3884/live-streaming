import React from "react";
import './styles/home.style.css'
import './styles/common.style.css'
import "bootstrap/dist/css/bootstrap.min.css";
import authService from '../services/auth.service'
import configs from '../config'
import axios from 'axios'
import NavBar from "../components/navbar.component";

class Home extends React.Component {

     constructor(props) {
          super(props)

          // check if user did not sign in
          let user = authService.getCurrentUser();
          if (!user) {
               this.props.history.push('/login')
               window.location.reload()
          }

          this.state = {
               broadcasters: [],
               user: JSON.parse(user)
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
                    <NavBar user={this.state.user} history={this.props.history} isStreaming={false}/>
                    <table className="table">
                         <thead className="thead-dark">
                              <tr>
                                   <th scope="col"><h1>Streamer online</h1></th>
                              </tr>
                         </thead>
                         <tbody>
                              {this.state.broadcasters.map((bc, i) => {
                                   let link = `/watch/${bc}`
                                   return (
                                        <tr key={i}>
                                             <td><a href={link}>{bc}</a></td>
                                        </tr>
                                   )
                              })}
                         </tbody>
                    </table>

                    <ul>

                    </ul>
               </div>
          )
     }
}

export default Home;
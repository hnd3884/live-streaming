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
               this.state = {
                    broadcasters: {},
                    user: null
               }
          }
          else {
               this.state = {
                    broadcasters: {},
                    user: JSON.parse(user)
               }
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
                    <NavBar user={this.state.user} history={this.props.history} isStreaming={false} />
                    <table className="table">
                         <thead className="bg-success text-light">
                              <tr>
                                   <th scope="col"><h1>On Stream</h1></th>
                              </tr>
                         </thead>
                         <tbody>
                              {Object.keys(this.state.broadcasters).length === 0 ? 'No streamer online' : (
                                   Object.keys(this.state.broadcasters).map((key, i) => {
                                        let link = `/watch/${this.state.broadcasters[key]}`
                                        return (
                                             <tr key={i}>
                                                  <td><a href={link}>{key}</a></td>
                                             </tr>
                                        )
                                   }
                              ))}
                         </tbody>
                    </table>

                    <ul>

                    </ul>
               </div>
          )
     }
}

export default Home;
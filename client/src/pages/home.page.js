import React from "react";
import '../styles/home.style.css'
import { config } from '../config'
import axios from 'axios'

class Home extends React.Component {

     constructor() {
          super()
          this.state = {
               broadcasters: []
          }
     }

     componentDidMount(){
          this.GetBroadCasters()
     }

     GetBroadCasters = () => {
          axios.get(`http://${config.NODE_IP}:${config.NODE_PORT}/broadcaster/list`)
               .then(res => {
                    this.setState({
                         broadcasters: res.data
                    })
               })
     }

     render() {
          return (
               <div>
                    <h1>Streamer online</h1>
                    <ul>
                         {this.state.broadcasters.map((bc, i) => {
                              let link = `/watch/${bc}`
                              return <li key={i}><a href={link}>{bc}</a></li>
                         })}
                    </ul>
               </div>
          )
     }
}

export default Home;
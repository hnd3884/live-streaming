import React from "react";
import './styles/home.style.css'
import io from 'socket.io-client'
import configs from '../config'
import NavBar from "../components/navbar.component";
import authService from "../services/auth.service";

class Watch extends React.Component {

     constructor(props) {
          super(props)

          // check if user did not sign in
          let user = authService.getCurrentUser();
          if (!user) {
               this.props.history.push('/login')
               window.location.reload()
          }

          this.state = {
               user: JSON.parse(user)
          }
     }

     componentDidMount() {
          // locate broadcaster id
          let broadcasterId = this.props.id

          // peer connection to broadcaster
          let peerConnection;

          // socket connection
          const socket = io(`${configs.API_URL}`);

          const video = document.getElementById("camera");

          // socket handler
          socket.on("offer", (id, description) => {
               console.log('offer')
               peerConnection = new RTCPeerConnection(configs.STUN_CONFIG);
               peerConnection
                    .setRemoteDescription(description)
                    .then(() => peerConnection.createAnswer())
                    .then(sdp => peerConnection.setLocalDescription(sdp))
                    .then(() => {
                         socket.emit("answer", id, peerConnection.localDescription);
                    });
               peerConnection.ontrack = event => {
                    video.srcObject = event.streams[0];
               };
               peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                         socket.emit("candidate", id, event.candidate);
                    }
               };
          });

          socket.on("candidate", (id, candidate) => {
               peerConnection
                    .addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(e => console.error(e));
          });

          socket.on("connect", () => {
               socket.emit("start-watching", broadcasterId);
          });

          socket.on("broadcaster", () => {
               socket.emit("watcher");
          });

          window.onunload = window.beforeunload = () => {
               socket.close();
               peerConnection.close();
          };

     }

     render() {
          return (
               <div>
                    <NavBar user={this.state.user} history={this.props.history} isStreaming={true} />
                    <video id='camera' playsInline autoPlay muted></video>
               </div>
          )
     }
}

export default Watch;
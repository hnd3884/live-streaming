import React from "react";
import './styles/home.style.css'
import io from 'socket.io-client'
import configs from '../config'
import NavBar from "../components/navbar.component";
import authService from "../services/auth.service";
import ChatContainer from "../components/chat.component";

class Watch extends React.Component {

     constructor(props) {
          super(props)

          // check if user did not sign in
          let user = authService.getCurrentUser();

          this.state = {
               user: JSON.parse(user),
               socket: io(`${configs.API_URL}`),
               messageList: []
          }
     }

     componentDidMount() {
          // locate broadcaster id
          let broadcasterId = this.props.broadcasterId

          // peer connection to broadcaster
          let peerConnection;

          const video = document.getElementById("camera");

          // socket handler
          this.state.socket.on("offer", (id, description) => {
               peerConnection = new RTCPeerConnection(configs.STUN_CONFIG);
               peerConnection
                    .setRemoteDescription(description)
                    .then(() => peerConnection.createAnswer())
                    .then(sdp => peerConnection.setLocalDescription(sdp))
                    .then(() => {
                         this.state.socket.emit("answer", id, peerConnection.localDescription);
                    });
               peerConnection.ontrack = event => {
                    video.srcObject = event.streams[0];
               };
               peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                         this.state.socket.emit("candidate", id, event.candidate);
                    }
               };
          });

          this.state.socket.on("candidate", (id, candidate) => {
               peerConnection
                    .addIceCandidate(new RTCIceCandidate(candidate))
                    .catch(e => console.error(e));
          });

          this.state.socket.on("connect", () => {
               this.state.socket.emit("start-watching", broadcasterId);
          });

          this.state.socket.on("chat", (watcherName, message) => {
               console.log(watcherName + ": " + message)
               this.setState({
                    messageList: [...this.state.messageList, {
                         time: new Date(),
                         message: message,
                         user: watcherName
                    }]
               })
          });

          this.state.socket.on("broadcaster", () => {
               this.state.socket.emit("watcher");
          });

          window.onunload = window.beforeunload = () => {
               this.state.socket.close();
               peerConnection.close();
          };

     }

     CommitMessage = (message) => {
          this.state.socket.emit("chat", message, this.state.user.name, this.props.broadcasterId)
          this.setState({
               messageList: [...this.state.messageList, {
                    time: new Date(),
                    message: message,
                    user: this.state.user.name
               }]
          })
     }

     render() {
          return (
               <div>
                    <NavBar user={this.state.user} history={this.props.history} isStreaming={false} />
                    <div className='row' style={{ margin: '0' }}>
                         <div id='stream-screen' className="col-md-9" style={{ textAlign: 'center', backgroundColor: 'black', margin: '0' }}>
                              <video id='camera' playsInline autoPlay muted></video>
                         </div>
                         <div className="col-md-3" style={{ margin: '0', padding:'0' }}>
                              <ChatContainer currentUser={this.state.user.name} messageList={this.state.messageList} commitMessage={this.CommitMessage} />
                         </div>
                    </div>
               </div>
          )
     }
}

export default Watch;
import React from "react";
import io from 'socket.io-client'
import '../styles/home.style.css'

class Home extends React.Component {

     // Stop streamming
     StopStreaming = () => {

     }

     // Start streaming
     StartStream = () => {
          // === socket handler ===
          const peerConnections = {};
          const config = {
               iceServers: [
                    {
                         urls: ["stun:stun.l.google.com:19302"]
                    }
               ]
          };

          const socket = io('localhost:5000');
          const video = document.querySelector("video");

          // Media contrains
          const constraints = {
               video: true,
               audio: true,
          };

          navigator.getUserMedia(constraints, stream => {
               video.srcObject = stream;
               socket.emit("broadcaster");
          }, err => console.error(err))

          socket.on("watcher", id => {
               const peerConnection = new RTCPeerConnection(config);
               peerConnections[id] = peerConnection;

               let stream = video.srcObject;
               stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

               peerConnection.onicecandidate = event => {
                    if (event.candidate) {
                         socket.emit("candidate", id, event.candidate);
                    }
               };

               peerConnection
                    .createOffer()
                    .then(sdp => peerConnection.setLocalDescription(sdp))
                    .then(() => {
                         socket.emit("offer", id, peerConnection.localDescription);
                    });
          });

          socket.on("answer", (id, description) => {
               peerConnections[id].setRemoteDescription(description);
          });

          socket.on("candidate", (id, candidate) => {
               peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
          });

          socket.on("disconnectPeer", id => {
               peerConnections[id].close();
               delete peerConnections[id];
          });

          window.onunload = window.onbeforeunload = () => {
               socket.close();
          };
     }

     render() {
          return (
               <div>
                    <h1>Streamer online</h1>
                    <ul>

                    </ul>
                    <hr></hr>
                    <div>
                         User: hoangnd&nbsp;
                    <button id='control-btn' onClick={this.StartStream}>Start streaming</button>
                         <div id='stream-screen' style={{ margin: '20px' }}>
                              <video playsInline autoPlay muted></video>
                         </div>
                    </div>
               </div>
          )
     }
}

export default Home;
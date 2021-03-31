import React from "react";
import '../styles/home.style.css'
import io from 'socket.io-client'
import config from '../config'

class Watch extends React.Component {
     componentDidMount() {

          // peer connection to streamer
          let peerConnection;

          // socket connection
          const socket = io(`${config.NODE_IP}:${config.NODE_PORT}`);

          const video = document.querySelector("video");

          // socket handler
          socket.on("offer", (id, description) => {
               console.log('offer')
               peerConnection = new RTCPeerConnection(config);
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
               socket.emit("watcher");
          });

          socket.on("broadcaster", () => {
               socket.emit("watcher");
          });

          window.onunload = window.onbeforeunload = () => {
               socket.close();
               peerConnection.close();
          };

     }

     render() {
          return (
               <video playsInline autoPlay muted></video>
          )
     }
}

export default Watch;
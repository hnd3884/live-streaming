import React from "react";
import '../styles/home.style.css'
import io from 'socket.io-client'

class Watch extends React.Component {
     componentDidMount() {
          let peerConnection;
          const config = {
               iceServers: [
                    {
                         urls: ["stun:stun.l.google.com:19302"]
                    }
               ]
          };

          // const socket = io('localhost:5000');
          const socket = io('192.168.1.6:5000');
          const video = document.querySelector("video");

          socket.on("offer", (id, description) => {
               peerConnection = new RTCPeerConnection(config);
               peerConnection
                    .setRemoteDescription(description)
                    .then(() => peerConnection.createAnswer())
                    .then(sdp => peerConnection.setLocalDescription(sdp))
                    .then(() => {
                         socket.emit("answer", id, peerConnection.localDescription);
                    });
               peerConnection.ontrack = function ({ streams: [stream] }) {
                    video.srcObject = stream;
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
               <div>
                    asas
                    <video playsInline autoPlay></video>
               </div>
          )
     }
}

export default Watch;
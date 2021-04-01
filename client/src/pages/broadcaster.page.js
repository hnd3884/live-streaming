import React from "react";
import io from 'socket.io-client'
import '../styles/home.style.css'
import { config } from '../config'

class BroadCaster extends React.Component {

    // Stop streamming
    StopStreaming = () => {

    }

    // Start streaming
    StartStream = () => {

        // client list
        const peerConnections = {};

        // socket connection
        const socket = io(`${config.NODE_IP}:${config.NODE_PORT}`);

        const video = document.querySelector("video");

        // Use camera
        // navigator.mediaDevices
        //      .getUserMedia(constraints)
        //      .then(stream => {
        //           video.srcObject = stream;
        //           socket.emit("broadcaster");
        //      })
        //      .catch(error => console.error(error));

        // Use screen
        navigator.mediaDevices.getDisplayMedia(config.VIDEO_CONSTRAINS)
            .then(function (mediaStream) {
                video.srcObject = mediaStream;
                socket.emit("broadcaster");
            })
            .catch(function (err) { console.log(err.name + ": " + err.message); });

        // Socket handler
        socket.on("start-watching", clientId => {
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[clientId] = peerConnection;

            let stream = video.srcObject;
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            });

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    socket.emit("candidate", clientId, event.candidate);
                }
            };

            peerConnection
                .createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    socket.emit("offer", clientId, peerConnection.localDescription);
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
                User: hoangnd&nbsp;
                <button id='control-btn' onClick={this.StartStream}>Start streaming</button>
                <div id='stream-screen' style={{ margin: '20px' }}>
                    <video playsInline autoPlay muted></video>
                </div>
            </div>
        )
    }
}

export default BroadCaster;
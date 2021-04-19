import React from "react";
import io from 'socket.io-client'
import './styles/broadcaster.style.css'
import configs from '../config'
import authService from "../services/auth.service";
import NavBar from "../components/navbar.component";
import ChatContainer from "../components/chat.component";

class BroadCaster extends React.Component {
    constructor() {
        super()

        // check if user did not sign in
        let user = authService.getCurrentUser();
        if (!user) {
            this.props.history.push('/login')
            window.location.reload()
        }

        this.state = {
            // client list
            peerConnections: {},
            // socket connection
            socket: io(`${configs.API_URL}`),
            user: JSON.parse(user),
            messageList: []
        }
    }

    componentDidMount() {
        const video = document.querySelector("video");

        // Use camera
        navigator.mediaDevices
            .getUserMedia(configs.VIDEO_CONSTRAINS)
            .then(stream => {
                video.srcObject = stream;
                this.state.socket.emit("broadcaster", this.state.user.name);
            })
            .catch(error => console.error(error));

        // Use screen
        // navigator.mediaDevices
        //     .getDisplayMedia(configs.VIDEO_CONSTRAINS)
        //     .then(stream => {
        //         video.srcObject = stream;
        //         this.state.socket.emit("broadcaster", this.state.user.name);
        //     })
        //     .catch(error => console.error(error));

        // Socket handler
        this.state.socket.on("start-watching", clientId => {
            const peerConnection = new RTCPeerConnection(configs.STUN_CONFIG);

            // update state
            this.setState(prevState => {
                let newPeerConnections = prevState.peerConnections
                newPeerConnections[clientId] = peerConnection
                return {
                    socket: this.state.socket,
                    peerConnections: newPeerConnections
                }
            })

            let streamCamera = video.srcObject;
            streamCamera.getTracks().forEach(track => {
                peerConnection.addTrack(track, streamCamera)
            });

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    this.state.socket.emit("candidate", clientId, event.candidate);
                }
            };

            peerConnection
                .createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(() => {
                    this.state.socket.emit("offer", clientId, peerConnection.localDescription);
                });
        });

        this.state.socket.on("answer", (id, description) => {
            this.state.peerConnections[id].setRemoteDescription(description);
        });

        this.state.socket.on("candidate", (id, candidate) => {
            this.state.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
        });

        this.state.socket.on("chat", (watcherName, message) => {
            this.setState({
                messageList: [...this.state.messageList, {
                    time: new Date(),
                    message: message,
                    user: watcherName
                }]
            })
        });

        this.state.socket.on("disconnectPeer", id => {
            this.state.peerConnections[id].close();
            delete this.state.peerConnections[id];
            console.log(this.state.peerConnections)
        });

        window.onunload = window.onbeforeunload = () => {
            this.state.socket.close();
        };
    }

    CommitMessage = (message) => {
        this.state.socket.emit("chat", message, this.state.user.name, this.state.socket.id)
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
                <NavBar user={this.state.user} history={this.props.history} isStreaming={true} />
                <div className='row' style={{ margin: '0' }}>
                    <div id='stream-screen' className="col-md-9" style={{ textAlign: 'center', backgroundColor: 'black', margin: '0' }}>
                        <video id='camera' playsInline autoPlay muted></video>
                    </div>
                    <div className="col-md-3" style={{ margin: '0', padding: '0' }}>
                        <ChatContainer currentUser={this.state.user.name} messageList={this.state.messageList} commitMessage={this.CommitMessage} />
                    </div>
                </div>
            </div>
        )
    }
}

export default BroadCaster;
import React from "react";
import io from 'socket.io-client'
import './styles/broadcaster.style.css'
import configs from '../config'
import authService from "../services/auth.service";
import NavBar from "../components/navbar.component";
import ChatContainer from "../components/chat.component";
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import { Dropdown } from "react-bootstrap";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

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
            messageList: [],
            password: '',
            shareMode: 0 // 0 => camera, 1 => screen
        }
    }

    componentDidMount() {
        document.getElementById('dropdown_switch').classList.remove('dropdown-toggle');

        // Use camera
        navigator.mediaDevices
            .getUserMedia(configs.VIDEO_CONSTRAINS)
            .then(stream => {
                document.querySelector("video").srcObject = stream;
                this.state.socket.emit("broadcaster", this.state.user.name, this.props.mode);
            })
            .catch(error => console.error(error));

        // Use screen
        // navigator.mediaDevices
        //     .getDisplayMedia(configs.VIDEO_CONSTRAINS)
        //     .then(stream => {
        //         document.querySelector("video").srcObject = stream;
        //         this.state.socket.emit("broadcaster", this.state.user.name, this.props.mode);
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

            let stream = document.querySelector("video").srcObject;
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
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

        this.state.socket.on("password", (password) => {
            console.log(password)
            this.setState({
                password: password
            })
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

    SwitchShare = (mode) => {
        if (mode === 1 && this.state.shareMode === 0) { // using camera
            // change camera to screen
            navigator.mediaDevices
                .getDisplayMedia(configs.VIDEO_CONSTRAINS)
                .then(stream => {
                    document.querySelector("video").srcObject = stream;
                    for (const [, peer] of Object.entries(this.state.peerConnections)) {
                        peer.getSenders().forEach(rtpSender => {
                            if (rtpSender.track.kind === 'video') {
                                rtpSender.replaceTrack(stream.getTracks()[0]).then(function () {
                                    console.log("Replaced video track from camera to screen");
                                }).catch(function (error) {
                                    console.log("Could not replace video track: " + error);
                                });
                            }
                        });
                    }
                })
                .catch(error => console.error(error));

            this.setState({
                shareMode: 1 - this.state.shareMode
            })
        }
        else if (mode === 0 && this.state.shareMode === 1) {
            // change screen to camera
            navigator.mediaDevices
                .getUserMedia(configs.VIDEO_CONSTRAINS)
                .then(stream => {
                    document.querySelector("video").srcObject = stream;
                    for (const [, peer] of Object.entries(this.state.peerConnections)) {
                        peer.getSenders().forEach(rtpSender => {
                            if (rtpSender.track.kind === 'video') {
                                console.log(234234234);
                                rtpSender.replaceTrack(stream.getVideoTracks()[0]).then(function () {
                                    console.log("Replaced video track from screen to camera");
                                }).catch(function (error) {
                                    console.log("Could not replace video track: " + error);
                                });
                            }
                        });
                    }
                })
                .catch(error => console.error(error));

            this.setState({
                shareMode: 1 - this.state.shareMode
            })
        }
    }

    render() {
        return (
            <div>
                <NavBar password={this.state.password} user={this.state.user} history={this.props.history} isStreaming={true} />

                <div className='row' style={{ margin: '0' }}>
                    <div id='stream-screen' className="col-md-9" style={{ textAlign: 'center', backgroundColor: 'black', margin: '0' }}>
                        <Dropdown>
                            <DropdownToggle id='dropdown_switch'>
                                <i className="fa fa-cog" aria-hidden="true"></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => this.SwitchShare(0)}>Camera</DropdownItem>
                                <DropdownItem onClick={() => this.SwitchShare(1)}>Screen</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
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
import { Component } from 'react';
import '../pages/styles/ChatContainer.css';
import '../../node_modules/font-awesome/css/font-awesome.min.css';
import Message from './message.component';

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      messHistory: props.messHistory,
      messageCommit: ""
    }
  }

  componentDidMount() {
    this.UpdateScroll();
  }

  UpdateScroll() {
    let element = document.getElementById("msghistory");
    element.scrollTop = element.scrollHeight;
  }

  componentDidUpdate() {
    this.UpdateScroll();
  }

  componentWillReceiveProps(newProps) {
    if (this.state.messHistory !== newProps.messHistory) {
      this.setState({ messHistory: newProps.messHistory });
    }
  }

  ChangeMessageCommit(event) {
    this.setState({ messageCommit: event.target.value });
  }

  CommitMessage(event) {
    if (this.state.messageCommit !== "") {
      this.props.commitMessage(this.state.messageCommit);
      this.setState({
        messageCommit: ""
      })
    }

    event.preventDefault();
  }

  render() {
    return (
      <div className="container">
        <h3 className=" text-center">Messaging</h3>
        <div className="messaging">
          <div className="inbox_msg">
            <div className="mesgs">

              {/*--- Mess history ---*/}
              <div className="msg_history" id="msghistory">
                <Message
                  isUser={true}
                  message="Hi there, i'm Hoang"
                  time="2020/01/02"
                  key={1}
                  username={"hoangnd"}
                >
                </Message>
                <Message
                  isUser={false}
                  message="Hi there, i'm Hoang"
                  time="2020/01/02"
                  key={2}
                  username={"hoangnd"}
                >
                </Message>
                <Message
                  isUser={false}
                  message="Hi there, i'm Hoang"
                  time="2020/01/02"
                  key={3}
                  username={"hoangnd"}
                >
                </Message>
              </div>
              {/*--- End mess history ---*/}

              <div className="type_msg">

                {/*--- Mess input field ---*/}
                <div className="input_msg_write">
                  <form>
                    <input type="text" value={this.state.messageCommit} className="write_msg" placeholder="Type a message" onChange={this.ChangeMessageCommit.bind(this)} />
                    <button className="msg_send_btn" type="submit" onClick={(e) => this.CommitMessage(e)}>
                      <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
                    </button>
                  </form>
                </div>
                {/*--- End mess input field ---*/}

              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatContainer;

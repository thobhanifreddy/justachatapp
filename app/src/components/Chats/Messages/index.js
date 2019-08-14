import React from 'react';
import { View, Platform, FlatList, Text, Dimensions } from 'react-native';
import { Divider, ActivityIndicator } from "react-native-paper"
import KeyboardSpacer from 'react-native-keyboard-spacer';
import firebase from "firebase";
import { connect } from "react-redux";
import moment from "moment";

import MessageBubble from "../MessageBubble"
import * as actions from "../../../../actions";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      users: null,
      user: null,
      receiver: null,
      fetched: false,
      unreadMessages: []

    };
  }

  componentDidMount = () => {
    this.setState({ user: firebase.auth().currentUser });
    var messageRef = firebase.database().ref('chats/' + this.getChatId(this.props.user.uid, this.props.receiver.uid));
    messageRef.on('child_added', (data) => {
      if (this.state.fetched && data.val().user.uid !== this.props.user.uid) {
        this.props.receiveMessage(data.val());
      }
    });
    this.setState({ fetched: this.props.fetched })
    this.getUnreadMessages()
  }
  getChatId = (sid, rid) => {
    if (sid > rid) return sid + rid

    return rid + sid;
  }

  getUnreadMessages = () => {
    let unreadMessages = [];
    if (this.props.unreadMessages.length > 0) {
      unreadMessages = this.props.unreadMessages.map(message => (message.receiver.uid === this.props.user.uid && message.user.uid === this.props.receiver.uid) ? message : null)
        .filter(m => m !== null)
      if (unreadMessages.length > 0) {
        this.setState({ unreadMessages })
        let firstUnreadMessage = unreadMessages[0];
        let firstNewMessageIndex = this.props.messages.findIndex(message => {
          return message.id === firstUnreadMessage.id
        });
        this.props.pushUnreadMessage(firstNewMessageIndex, this.props.user, this.props.receiver);
      }
    }
  }

  clearUnreadMessages = (unreadMessages) => {
    this.props.clearUnreadMessages(unreadMessages);
    this.setState({ unreadMessages: [] })
  }

  render() {
    console.log("SHOW DATE =>", this.props.messages);
    return (
      <View style={{ flex: 1 }} >
        <>
          <FlatList inverted data={this.props.messages && this.props.messages.slice().reverse()} renderItem={({ item, index }) => {
            if (item.type == "unread" && item.receiver.uid === this.props.receiver.uid) {
              if (this.state.unreadMessages.length > 0) {
                this.clearUnreadMessages(this.state.unreadMessages)

              }

              return (
                <View>
                  <Divider style={{ marginTop: 20 }} />
                  <Text style={{ fontSize: 14, alignSelf: "center", fontWeight: "bold" }}>New Messages</Text>
                  <Divider style={{ marginBottom: 20 }} />
                </View>
              )
            }
            let right = this.props.user.uid === item.user.uid;
            return (
              <>
                <MessageBubble right={right} message={item} avtar={true} receiverName={false} />
                {(moment().diff(moment(item.timeStamp), "days") > 0 || index === this.props.messages.length - 1) && <Text style={{ fontSize: 14, alignSelf: "center", fontWeight: "100" }}>{moment(item.timeStamp).format("LL")}</Text>}
              </>
            )
          }} >

          </FlatList>
          <KeyboardSpacer topSpacing={Dimensions.get("screen").height > 800 ? 30 : 10} />
        </>
      </View >
    )
  }
}

function mapStateToProps({ loading, chat, unreadChat }) {

  return {
    loading: loading.loading,
    messages: chat.messages,
    message: chat.message,
    fetched: chat.fetched,
    unreadMessages: unreadChat.unreadMessages
  };
}

export default connect(
  mapStateToProps,
  actions
)(Messages);

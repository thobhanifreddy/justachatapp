import React from 'react';
import { View, Platform, TextInput, Dimensions } from 'react-native';
import { IconButton, DefaultTheme } from "react-native-paper"
import KeyboardSpacer from 'react-native-keyboard-spacer';
import firebase from "firebase";
import { connect } from "react-redux";

import * as actions from "../../../../actions";
import { uuidv4 } from "../../../Helper";


class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null
    };
  }

  sendMessage = async () => {
    let user = firebase.auth().currentUser;
    let message = {
      id: uuidv4(),
      text: this.state.text,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      receiver: this.props.receiver,
      type: "text",
      timeStamp: new Date().valueOf()
    };

    this.props.sendMessage(this.props.user, this.props.receiver, message);
    this.setState({ text: null });
  }

  render() {
    return (
      <View
        style={{ justifyContent: "flex-end", height: "10%" }}>
        <View style={{ flexDirection: "row", borderTopWidth: 1 }}>
          <TextInput
            multiline
            placeholder="Type message here..."
            style={{ flex: 3, padding: 10 }}
            value={this.state.text}
            onChangeText={(text) => this.setState({ text })}
          />
          <IconButton icon="send" color={DefaultTheme.colors.primary} style={{ flex: 0.3 }} onPress={this.sendMessage}>Send</IconButton>
        </View>
        <KeyboardSpacer topSpacing={(Dimensions.get("screen").height > 800 && Platform.OS === "android") ? 30 : 0} />
      </View>
    )
  }
}

function mapStateToProps({ loading, chat }) {

  return { loading: loading.loading, messages: chat.messages };
}

export default connect(
  mapStateToProps,
  actions
)(MessageInput);

import React from 'react';
import { View } from 'react-native';
import { connect } from "react-redux";
import firebase from "firebase";
import { ActivityIndicator } from "react-native-paper"

import NavBar from "../../components/NavBar/index";
import Messages from "../../components/Chats/Messages";
import MessageInput from "../../components/Chats/MessageInput";
import * as actions from "../../../actions";

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      receiver: null
    };
  }
  static navigationOptions = ({ navigation }) => {
    return { header: <NavBar title={navigation.getParam('user').displayName ? navigation.getParam('user').displayName : navigation.getParam('user').email} back={true} /> };
  }

  componentDidMount = async () => {
    this.props.handleLoading(true);
    try {
      await this.props.initChat(firebase.auth().currentUser, this.props.navigation.getParam('user'))
      this.props.handleLoading(false);
    } catch (error) {
      alert(error);
      console.log(error)
      this.props.handleLoading(false);
    }
    this.setState({ user: firebase.auth().currentUser, receiver: this.props.navigation.getParam('user') })
  }

  render() {
    if (this.props.loading) return <ActivityIndicator style={{
      flex: 1,
      justifyContent: "center",
      alignSelf: "center"
    }} />
    return (
      <View style={{ flex: 1 }} >
        <Messages user={firebase.auth().currentUser} receiver={this.props.navigation.getParam('user')} />
        <MessageInput user={this.state.user} receiver={this.state.receiver} />
      </View >
    )
  }
}


function mapStateToProps({ loading, chat }) {

  return { loading: loading.loading, messages: chat.messages };
}

export default connect(
  mapStateToProps,
  actions
)(ChatRoom);

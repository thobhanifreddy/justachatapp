import React from "react";
import { ScrollView } from "react-native";
import { List, ActivityIndicator, Text } from "react-native-paper";
import firebase from "firebase";
import 'firebase/functions'
import { connect } from "react-redux";

import NavBar from "../../components/NavBar/index";
import * as actions from "../../../actions";
import unreadChat from "../../../reducers/unreadChat";


class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: null,
      user: null
      //unReadMessages: [{ id: "1234", text: "test message", unRead: true, user: { uid: "5DuBAtAP7rYzVvhJN8kWmOR0eF42", displayName: "Test profile", email: "abc@xyz.com", photoURL: "https://firebasestorage.googleapis.com/v0/b/just-a-chat-app-by-freddy.appspot.com/o/5DuBAtAP7rYzVvhJN8kWmOR0eF42?alt=media&token=5b117e04-9095-48cb-b87c-fd421d3382fa" } }]
    };
    this.fetchUsers = this.fetchUsers.bind(this)
  }

  static navigationOptions = ({ navigation }) => {
    return { header: <NavBar title="Chats" drawer={true} refresh={true} refreshAction={navigation.getParam('refreshAction')} /> }
  }

  componentDidMount = async () => {
    this.props.handleLoading(false);
    this.props.navigation.setParams({ refreshAction: this.fetchUsers });

    try {
      await this.fetchUsers()
    } catch (error) {
      console.log(error);
      this.props.handleLoading(false);

    }
  };

  startChat = (user) => {
    this.props.navigation.navigate("ChatRoom", { user })
  }

  getUnreadMessages = (user) => {
    let unReadMessages = [];
    if (this.props.unreadMessages.length > 0) {
      unReadMessages = this.props.unreadMessages.map(message => (message.user.uid === user.uid && message.receiver.uid === this.state.user.uid) ? message : null)
        .filter(m => m !== null)
    }
    return unReadMessages.length > 0 ? unReadMessages : null;

  }

  fetchUsers = async () => {
    this.props.handleLoading(true);
    let users = await fetch("https://us-central1-just-a-chat-app-by-freddy.cloudfunctions.net/api/users");
    users = await users.json()
    let user = firebase.auth().currentUser;
    this.setState({ user })
    users = users.users.filter(u => u.email !== user.email);
    this.setState({ users })
    this.props.handleLoading(false);
  }

  render() {
    if (this.props.loading) return <ActivityIndicator style={{
      flex: 1,
      justifyContent: "center",
      alignSelf: "center"
    }} />
    return (
      <ScrollView style={{ flex: 1 }}>

        {this.state.users && this.state.users.map((user) => {
          return (
            <List.Item
              key={user.uid}
              title={user.displayName ? user.displayName : user.email}
              onPress={() => this.startChat(user)}
              titleStyle={{ fontWeight: this.getUnreadMessages(user) ? "bold" : "normal" }}
              description={this.getUnreadMessages(user) ? "unread messages" : null}
              descriptionStyle={{ fontWeight: this.getUnreadMessages(user) ? "bold" : "normal" }}
              right={() => this.getUnreadMessages(user) ? <Text style={{ fontWeight: "bold" }}>{this.getUnreadMessages(user).length}</Text> : null}
            ></List.Item>
          )
        }
        )}
      </ScrollView>
    );
  }
}

function mapStateToProps({ loading, unreadChat }) {

  return { loading: loading.loading, unreadMessages: unreadChat.unreadMessages };
}

export default connect(
  mapStateToProps,
  actions
)(Home);

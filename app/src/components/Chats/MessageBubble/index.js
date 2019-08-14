import React from 'react';
import { View, Text } from 'react-native';
import { Avatar, DefaultTheme } from "react-native-paper"
import moment from 'moment';
import { connect } from "react-redux";

import * as actions from "../../../../actions";

class MessageBubble extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { right, message, avtar, receiverName } = this.props
    return (
      <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: right ? "flex-end" : "flex-start" }}>
        {(!right && avtar) && <Avatar.Image size={32} source={{ uri: "https://picsum.photos/700" }} style={{ alignSelf: "flex-end" }} />}
        <View style={{
          marginLeft: 5,
          marginRight: 5,
          backgroundColor: right ? DefaultTheme.colors.primary : "#e3e3e3",
          borderRadius: 10,
          padding: 10,
          justifyContent: "space-between",
          paddingTop: (right || !receiverName) ? 10 : 0,
          maxWidth: "60%"
        }}>

          {(!right && receiverName) && <Text style={{ color: right ? "#fff" : "#000", marginBottom: 2, color: DefaultTheme.colors.accent }}>{message.user.name}</Text>}
          <Text style={{ color: right ? "#fff" : "#000", fontSize: 18 }}>{message.text}</Text>
          <Text style={{ color: right ? "#fff" : "#000", textAlign: right ? "right" : "left", fontSize: 10, marginTop: 2 }}>{moment(message.timeStamp).format('LT')}</Text>
        </View>
        {/* {right && <Avatar.Image size={32} source={{ uri: "https://picsum.photos/700" }} style={{ alignSelf: "flex-end" }} />} */}
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
)(MessageBubble);

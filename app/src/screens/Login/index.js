import React from "react";
import { View, KeyboardAvoidingView } from "react-native";
import {
  Headline,
  Card,
  TextInput,
  Button,
  Caption,
  ActivityIndicator
} from "react-native-paper";
import firebase from "firebase";
import { connect } from "react-redux";

import * as actions from "../../../actions";
import { styles } from "./style"

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      error: false,
      message: null,
      user: false
    };
  }
  static navigationOptions = { header: null };

  handleLogin = async () => {
    if (this.state.email && this.state.password) {
      this.props.handleLoading(true);
      try {
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        let user = await firebase
          .auth()
          .signInWithEmailAndPassword(this.state.email, this.state.password);

        this.props.loginUser(user);

        var messagesRef = firebase.database().ref()
        messagesRef.on('child_changed', (data) => {
          for (let key in data.val()) {
            if (key.includes(user.uid)) {
              let json = data.val()[key]
              let message = json[Object.keys(json).sort().pop()]
              this.props.updateUnreadMessages(message)
              break;
            }
          }
        });
        this.setState({ error: false, message: null })
        this.props.navigation.navigate("Home");
      } catch (error) {
        this.setState({ error: true, message: error.message });
      }
      this.props.handleLoading(false);
    }
  };

  componentDidMount = async () => {
    this.props.handleLoading(true);
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var messagesRef = firebase.database().ref()
        messagesRef.on('child_changed', (data) => {
          for (let key in data.val()) {
            if (key.includes(user.uid)) {
              let json = data.val()[key]
              let message = json[Object.keys(json).sort().pop()]
              this.props.updateUnreadMessages(message)
              break;
            }
          }
        });
        this.props.navigation.navigate("Home");
      } else {
        this.props.handleLoading(false);
      }
    });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    if (this.props.loading) {
      return (
        <ActivityIndicator
          size="large"
          animating={true}
          style={styles.loading}
        />
      );
    }
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={0}
      >
        <View style={styles.container}>
          <Headline style={styles.title}>
            Just A Chat App
          </Headline>

          <Card>
            <Card.Title title="Login" />

            <Card.Content>
              <TextInput
                mode="outlined"
                label="Email"
                placeholder="abc@xyz.com"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
              <TextInput
                mode="outlined"
                label="Password"
                placeholder="something secret"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
              />
            </Card.Content>

            <Card.Actions>
              <Button
                onPress={this.handleLogin}
                disabled={
                  !(
                    this.state.email &&
                    this.state.email.length &&
                    this.state.password
                  )
                }
              >
                Login
              </Button>
            </Card.Actions>
          </Card>

          {this.state.error && (
            <Caption style={styles.errorMessage}>
              {this.state.message}
            </Caption>
          )}

          <Caption
            style={styles.registerCaption}
            onPress={() => this.props.navigation.navigate("Register")}
          >
            Not a Member? Register
          </Caption>
          <Caption
            style={styles.forgetPasswordCaption}
            onPress={() => alert("Contact Admin")}
          >
            Forget Password
          </Caption>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

function mapStateToProps({ auth, loading }) {
  return auth, loading;
}

export default connect(
  mapStateToProps,
  actions
)(Login);

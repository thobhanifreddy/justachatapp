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
import { styles } from "./style";

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
      verifyPassword: null,
      error: false,
      emailError: false,
      message: null
    };
  }
  static navigationOptions = { header: null };

  checkValidFormat() {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        this.state.email
      )
    ) {
      this.setState({ emailError: true, message: "Invalid Email" });
      return false;
    } else if (this.state.email && this.state.email.length <= 6) {
      this.setState({
        error: true,
        message: "Password must be atlest 6 characters"
      });
      return false;
    } else if (this.state.password !== this.state.verifyPassword) {
      this.setState({ error: true, message: "Password does not match" });
      return false;
    }
    this.setState({ error: false, emailError: null, message: null });
    return true;
  }

  componentDidMount = () => {
    console.log(this.props);
  };

  onRegister = async () => {
    if (this.checkValidFormat()) {
      try {
        this.props.handleLoading(true);
        await firebase
          .auth()
          .setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        let user = await firebase
          .auth()
          .createUserWithEmailAndPassword(
            this.state.email,
            this.state.password
          );
        await user.updateProfile({ displayName: user.email.split("@")[0] })
        this.props.handleLoading(false);
        this.props.navigation.navigate("Home");
      } catch (error) {
        this.props.handleLoading(false);

        this.setState({
          emailError: true,
          error: true,
          message: error.message
        });
      }
      this.props.handleLoading(false);
    }
  };

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
            <Card.Title title="Register" />
            <Card.Content>
              <TextInput
                mode="outlined"
                label="Email"
                placeholder="abc@xyz.com"
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
                error={this.state.emailError}
              />
              <TextInput
                mode="outlined"
                label="Password"
                placeholder="something secret"
                secureTextEntry={true}
                value={this.state.password}
                onChangeText={password => this.setState({ password })}
                error={this.state.error}
              />
              <TextInput
                mode="outlined"
                label="Verify Password"
                placeholder="make sure it matches"
                secureTextEntry={true}
                value={this.state.verifyPassword}
                onChangeText={verifyPassword =>
                  this.setState({ verifyPassword })
                }
                error={this.state.error}
              />
            </Card.Content>
            <Card.Actions>
              <Button onPress={this.onRegister}>Register</Button>
            </Card.Actions>
          </Card>
          {(this.state.error || this.state.emailError) && (
            <Caption style={styles.errorMessage}>
              {this.state.message}
            </Caption>
          )}
          <Caption
            style={styles.loginCaption}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Already a Member? Login
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
)(Register);

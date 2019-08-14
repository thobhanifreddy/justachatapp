import React from "react";
import { View, Dimensions, Permissions, Platform } from "react-native";
import {
  Text,
  TextInput,
  ActivityIndicator,
  Card,
  Button,
  Switch,
  IconButton,
  Colors
} from "react-native-paper";
import * as firebase from "firebase";
import Constants from "expo-constants";
import { connect } from "react-redux";
import * as ImagePicker from "expo-image-picker";

import NavBar from "../../components/NavBar/index";
import * as actions from "../../../actions";
import { styles } from "./style";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      displayName: null,
      profilePicture: null,
      profileLoading: false
    };
  }
  static navigationOptions = {
    header: <NavBar title="Profile" drawer={true} />
  };

  handleLogout = async () => {
    this.props.handleLoading(true);
    await firebase.auth().signOut();
    this.props.handleLoading(false);
    this.props.navigation.navigate("Login");
  };

  sendEmailVerification = async () => {
    this.props.handleLoading(true);
    this.forceUpdate();
    this.setState({ state: this.state });
    try {
      alert(firebase.auth().currentUser.emailVerified);
      if (!firebase.auth().currentUser.emailVerified) {
        await this.state.user.sendEmailVerification();
      } else {
        this.setState({ user: firebase.auth().currentUser });
      }
      this.props.handleLoading(false);
    } catch (error) {
      alert(error.message);
      this.props.handleLoading(false);
    }
  };

  handleProfileUpdate = async uri => {
    this.props.handleLoading(true);
    let downalodUri;
    try {
      if (uri) {
        downalodUri = await this.uploadImage();
      }
      await this.state.user.updateProfile({
        displayName: this.state.displayName,
        photoURL: downalodUri
      });
      alert("Profile Update Successfully");
      this.props.handleLoading(false);
    } catch (error) {
      alert(error.message);
      this.props.handleLoading(false);
    }
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  _pickImage = async () => {
    this.getPermissionAsync();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1]
    });
    if (!result.cancelled) {
      this.setState({ image: result.uri });
    }
    this.setState({ profilePicture: result.uri });
  };

  uploadImage = async () => {
    const response = await fetch(this.state.profilePicture);
    const blob = await response.blob();
    let ref = await firebase
      .storage()
      .ref()
      .child(this.state.user.uid);
    await ref.put(blob);
    let downloadUrl = await ref.getDownloadURL();
    return downloadUrl;
  };

  componentDidMount = () => {
    let user = firebase.auth().currentUser;
    this.setState({
      user: user,
      displayName: user.displayName,
      profilePicture: user.photoURL
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {!this.props.loading && this.state.user ? (
          <View>
            <Card>
              <Card.Title title="Profile" />
              <Card.Content>
                {this.state.profileLoading ? (
                  <ActivityIndicator
                    style={styles.uploadImageLoading}
                  />
                ) : (
                    <View>
                      <Card.Cover
                        source={{
                          uri: this.state.profilePicture
                            ? this.state.profilePicture
                            : "https://picsum.photos/700"
                        }}
                      />
                      <IconButton
                        icon="file-upload"
                        size={28}
                        color={"#6200ee"}
                        style={styles.uploadImageIcon}
                        onPress={() => this._pickImage()}
                      />
                    </View>
                  )}
              </Card.Content>
              <Card.Content>
                <TextInput
                  mode="outlined"
                  label="Email"
                  disabled
                  value={this.state.user.email}
                  onChangeText={email => this.setState({ email })}
                />
                <TextInput
                  mode="outlined"
                  label="Display Name"
                  placeholder="Display Name"
                  value={this.state.displayName}
                  onChangeText={displayName => this.setState({ displayName })}
                />
              </Card.Content>
              <Card.Content
                style={styles.emailVerifiactionContainer}
              >
                <Text>Email Verification</Text>
                {this.state.user.emailVerified ? (
                  <Switch value={true} />
                ) : (
                    <Button
                      mode="contained"
                      onPress={() => this.sendEmailVerification()}
                    >
                      Send email
                  </Button>
                  )}
              </Card.Content>

              <Card.Actions>
                <Button
                  onPress={() =>
                    this.handleProfileUpdate(this.state.profilePicture)
                  }
                >
                  Update
                </Button>
              </Card.Actions>
            </Card>
          </View>
        ) : (
            <ActivityIndicator
              style={styles.loading}
            />
          )}
        {/* <Title>User Name: {this.state.user && this.state.user.email}</Title> */}
      </View>
    );
  }
}

function mapStateToProps({ auth, loading }) {
  return auth, loading;
}

export default connect(
  mapStateToProps,
  actions
)(Profile);

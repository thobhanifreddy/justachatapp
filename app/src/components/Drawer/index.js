import React from "react";
import { SafeAreaView, Dimensions } from "react-native";
import { Drawer as PaperDrawer, IconButton, Title } from "react-native-paper";
import { connect } from "react-redux";
import * as firebase from "firebase";
import { DrawerActions } from "react-navigation";

import * as actions from "../../../actions";
import { styles } from "./style";

class Drawer extends React.Component {
  constructor(props) {
    super(props);
  }

  getRouteName = () => {
    let routes = this.props.navigation.state.routes[0].routes
    let route = routes[routes.length - 1];
    return route.routeName;
  };

  handleLogout = async () => {
    this.props.handleLoading(true);
    await firebase.auth().signOut();
    this.props.handleLoading(false);
    this.props.navigation.navigate("Login");
  };

  render() {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <PaperDrawer.Section>
          <Title style={styles.title}>
            Just A Chat App
          </Title>
        </PaperDrawer.Section>
        <PaperDrawer.Section
          style={styles.navigationSection}
        >
          <PaperDrawer.Item
            style={styles.item}
            label="Chats"
            active={this.getRouteName() === "Home"}
            onPress={() => this.props.navigation.navigate("Home")}
          />
          <PaperDrawer.Item
            label="Profile"
            active={this.getRouteName() === "Profile"}
            onPress={() => this.props.navigation.navigate("Profile")}
            style={styles.item}
          />
          <PaperDrawer.Item
            label="Logout"
            onPress={() => this.handleLogout()}
            style={styles.item}
          />
        </PaperDrawer.Section>
        <PaperDrawer.Section
          style={styles.closeSection}
        >
          <IconButton
            icon="close"
            size={30}
            onPress={() =>
              this.props.navigation.dispatch(DrawerActions.toggleDrawer())
            }
          />
        </PaperDrawer.Section>
      </SafeAreaView>
    );
  }
}

function mapStateToProps({ auth, loading }) {
  return auth, loading;
}

export default connect(
  mapStateToProps,
  actions
)(Drawer);

import React from "react";
import { Dimensions } from "react-native";
import {
  createStackNavigator,
  createAppContainer,
  createDrawerNavigator
} from "react-navigation";
import Login from "../src/screens/Login";
import Register from "../src/screens/Register";
import Home from "../src/screens/Home";
import Profile from "../src/screens/Profile";
import Drawer from "../src/components/Drawer";
import ChatRoom from "../src/screens/ChatRoom";
import NavBar from "../src/components/NavBar";


const InnerStackNavigator = createStackNavigator({

  Home: {
    screen: Home,
    heafer: <NavBar title="Chats" drawer={true} />
  },
  Profile: {
    screen: Profile
  },
  ChatRoom: {
    screen: ChatRoom
  }
},
  { initialRouteName: "Home" }
)

const DrawerNavigator = createDrawerNavigator(
  {
    drawerStack: { screen: InnerStackNavigator }

  },
  {
    contentComponent: props => <Drawer {...props} />,
    drawerPosition: "right",
    hideStatusBar: true,
    drawerWidth: Dimensions.get("screen").width,

  }
);


const Navigation = createStackNavigator(
  {
    Login: {
      screen: Login
    },
    Register: {
      screen: Register
    },
    Drawer: {
      screen: DrawerNavigator,
      navigationOptions: {
        header: null,
      }
    }

  },
  { initialRouteName: "Login", headerMode: 'none' }
);

export default createAppContainer(Navigation);

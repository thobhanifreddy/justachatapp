import React from 'react';
import { Dimensions } from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator } from 'react-navigation';

import Login from '../src/screens/Login/';
import Register from '../src/screens/Register';
import Home from '../src/screens/Home';

const Navigation = createStackNavigator(
	{
		Home:
			{
				screen: Home
			},
		Login:
			{
				screen: Login
			},
		Register:
			{
				screen: Register
			}
	},
	{ initialRouteName: 'Login', headerMode: 'none' }
);

export default createAppContainer(Navigation);

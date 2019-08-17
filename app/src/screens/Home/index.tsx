import React from 'react';
import { inject, observer } from 'mobx-react';
import { Headline, Button } from 'react-native-paper';
import { View } from 'react-native';
import firebase from 'firebase';

class Home extends React.Component<any, any> {
	componentDidMount = () => {
		this.props.loading.set(false);
	};

	logout = async () => {
		await firebase.auth().signOut();
		this.props.navigation.navigate('Login');
	};

	render() {
		return (
			<View>
				<Headline>HOME</Headline>
				<Button onPress={() => this.logout()}>out</Button>
			</View>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({ user, loading }))(observer(Home));

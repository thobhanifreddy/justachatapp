import React from 'react';
import { inject, observer } from 'mobx-react';
import { Headline, Button, Text } from 'react-native-paper';
import { View } from 'react-native';
import firebase from 'firebase';

import NavBar from '../../components/NavBar';

class Home extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}
	static navigationOptions = ({ navigation }) => {
		return { header: <NavBar title="Chats" drawer={true} /> };
	};

	componentDidMount = async () => {
		this.props.loading.set(false);
		await this.props.user.get();
		console.log(this.props.user.gender === 'm' ? 'Male' : this.props.user.gender === 'f' ? 'Female' : 'Other');
	};

	logout = async () => {
		await firebase.auth().signOut();
		this.props.navigation.navigate('Login');
	};

	render() {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: 'center',
					alignSelf: 'center'
				}}
			>
				<Headline>HOME</Headline>
				<Text>User Name: {this.props.user.displayName}</Text>
				<Text>Email: {this.props.user.email}</Text>
				<Text>
					Gender :{' '}
					{this.props.user.gender == 'm' ? 'Male' : this.props.user.gender == 'f' ? 'Female' : 'Other'}
				</Text>
				<Button mode="outlined" onPress={() => this.logout()}>
					LOGOUT
				</Button>
			</View>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({ user, loading }))(observer(Home));

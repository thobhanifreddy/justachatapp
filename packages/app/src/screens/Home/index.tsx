import React from 'react';
import { inject, observer } from 'mobx-react';
import { ActivityIndicator, List, Avatar, Divider } from 'react-native-paper';
import { ScrollView, View } from 'react-native';
import firebase from 'firebase';

import { styles } from './style';
import NavBar from '../../components/NavBar';
import User from 'justachatapp-sdk';

class Home extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			users: null
		};
	}
	static navigationOptions = ({ navigation }) => {
		return { header: <NavBar title="Chats" drawer={true} /> };
	};

	componentDidMount = async () => {
		this.props.loading.set(true);
		await this.props.user.get();
		let users: any = await this.props.user.getAll();
		users = await users.json();
		if (users.users) {
			users = users.users.filter((u: User) => u.uid !== this.props.user.uid);
			this.setState({ users });
		}
		this.props.loading.set(false);
	};

	logout = async () => {
		await firebase.auth().signOut();
		this.props.navigation.navigate('Login');
	};

	render() {
		let { loading } = this.props;
		if (loading.state) {
			return <ActivityIndicator size="large" animating={true} style={styles.loading} />;
		}
		return (
			<ScrollView style={{ flex: 1 }}>
				{this.state.users &&
					this.state.users.map((user: User) => {
						return (
							<View key={user.uid}>
								<List.Section style={{ marginTop: 10, marginBottom: 10 }}>
									<List.Item
										key={user.uid}
										title={user.displayName}
										titleStyle={{ fontSize: 20, fontWeight: 'bold', marginLeft: 5 }}
										left={() => (
											<Avatar.Image
												size={40}
												source={{
													uri:
														user.photoURL
															? user.photoURL
															: `https://source.unsplash.com/random/300x300/?${user.gender ==
																'm'
																	? 'male'
																	: 'female'},face`
												}}
											/>
										)}
									/>
								</List.Section>
								<Divider />
							</View>
						);
					})}
			</ScrollView>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({ user, loading }))(observer(Home));

import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { Headline, Card, TextInput, Button, Caption, ActivityIndicator } from 'react-native-paper';
import { inject, observer } from 'mobx-react';
import firebase from 'firebase';

import { styles } from './style';

class Login extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {
			password: '1234567890',
			error: false,
			message: null
		};
	}
	static navigationOptions = { header: null };

	login = async () => {
		let { user, loading } = this.props;
		try {
			this.props.loading.set(true);
			await user.firebaseLogin(user.email, this.state.password);
			if (user.uid) {
				this.props.navigation.navigate('Home');
				this.props.loading.set(false);
			}
		} catch (error) {
			console.log(error);
			this.setState({ error: true, message: error.message });
			this.props.loading.set(false);
		}
	};

	componentDidMount = () => {
		this.props.loading.set(false);

		this.props.loading.set(true);
		firebase.auth().onAuthStateChanged((user) => {
			console.log(user);
			if (user) {
				this.props.user.setUser(user);
				this.props.navigation.navigate('Home');
			}
			this.props.loading.set(false);
		});
	};

	render() {
		let { user, loading } = this.props;
		return (
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled keyboardVerticalOffset={0}>
				<View style={styles.container}>
					<Headline style={styles.title}>Just A Chat App</Headline>
					{loading.state ? (
						<ActivityIndicator size="large" animating={true} />
					) : (
						<View>
							<Card>
								<Card.Title title="Login" />
								<Card.Content>
									<TextInput
										mode="outlined"
										label="Email"
										placeholder="abc@xyz.com"
										value={user.email}
										onChangeText={(email) => user.setEmail(email)}
									/>
									<TextInput
										mode="outlined"
										label="Password"
										placeholder="something secret"
										secureTextEntry={true}
										value={this.state.password}
										onChangeText={(password) => this.setState({ password })}
									/>
								</Card.Content>
								<Card.Actions>
									<Button
										mode={'contained'}
										disabled={!(user.email && user.email.length && this.state.password)}
										style={styles.LoginButton}
										onPress={this.login}
									>
										Login
									</Button>
								</Card.Actions>
							</Card>
							{this.state.error && <Caption style={styles.errorMessage}>{this.state.message}</Caption>}
							<Caption
								style={styles.registerCaption}
								onPress={() => this.props.navigation.navigate('Register')}
							>
								Not a Member? Register
							</Caption>
							<Caption style={styles.forgetPasswordCaption} onPress={() => alert('Contact Admin')}>
								Forget Password
							</Caption>
						</View>
					)}
				</View>
			</KeyboardAvoidingView>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({ user, loading }))(observer(Login));

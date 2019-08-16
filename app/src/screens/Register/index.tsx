import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { Headline, Card, TextInput, Button, Caption, Checkbox, Subheading, Text } from 'react-native-paper';
import { observer, inject } from 'mobx-react';

import { styles } from './style';

class Register extends React.Component<any, any> {
	constructor(props) {
		super(props);
		{
			this.state = {
				password: '1234567890',
				verifyPassword: '1234567890',
				emailError: false,
				message: null
			};
		}
	}
	static navigationOptions = { header: null };

	checkValidation = () => {
		let { user } = this.props;
		if (
			!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
				user.email
			)
		) {
			this.setState({ emailError: true, message: 'Invalid Email' });
			return false;
		} else if (this.state.password.length <= 6) {
			this.setState({
				error: true,
				message: 'Password must be atlest 6 characters'
			});
			return false;
		} else if (this.state.password !== this.state.verifyPassword) {
			this.setState({ error: true, message: 'Password does not match' });
			return false;
		}
		this.setState({ error: false, emailError: null, message: null });
		return true;
	};

	register = async () => {
		let { user } = this.props;
		console.log(user.email, user.displayName);
		if (this.checkValidation) {
			let createdUSer = await user.createUserWithEmailPassword(this.state.password);
			console.log('created USER', createdUSer);
		}
	};

	render() {
		let { user } = this.props;
		if (user.uid) {
			console.log('USER CREATED');
		}
		return (
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled keyboardVerticalOffset={0}>
				<View style={styles.container}>
					<Headline style={styles.title}>Just A Chat App</Headline>
					<Card>
						<Card.Title title="Register" />
						<Card.Content>
							<TextInput
								mode="outlined"
								label="Email"
								placeholder="abc@xyz.com"
								onChangeText={(email) => user.setEmail(email)}
								value={user.email}
							/>
							<TextInput
								mode="outlined"
								label="Display Name"
								placeholder="Rick"
								onChangeText={(name) => user.setDisplayName(name)}
								value={user.displayName}
							/>
							<TextInput
								mode="outlined"
								label="Password"
								placeholder="something secret"
								secureTextEntry={true}
								value={this.state.password}
								onChangeText={(password: string) => this.setState({ password })}
							/>
							<TextInput
								mode="outlined"
								label="Verify Password"
								placeholder="Make sure it matches"
								secureTextEntry={true}
								value={this.state.verifyPassword}
								onChangeText={(verifyPassword) => this.setState({ verifyPassword })}
							/>

							<Subheading> GENDER </Subheading>
							<View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
								<Text>Male</Text>
								<Checkbox
									status={user.gender === 'm' ? 'checked' : 'unchecked'}
									onPress={() => user.setGender('m')}
								/>
								<Text>Female</Text>
								<Checkbox
									status={user.gender === 'f' ? 'checked' : 'unchecked'}
									onPress={() => user.setGender('f')}
								/>
								<Text>Other</Text>
								<Checkbox
									status={user.gender === 'o' ? 'checked' : 'unchecked'}
									onPress={() => user.setGender('o')}
								/>
							</View>
						</Card.Content>
						<Card.Actions>
							<Button mode={'contained'} style={styles.registerButton} onPress={this.register}>
								Register
							</Button>
						</Card.Actions>
					</Card>
					<Caption style={styles.loginCaption} onPress={() => this.props.navigation.navigate('Login')}>
						Already a Member? Login
					</Caption>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({
	user,
	loading
}))(observer(Register));

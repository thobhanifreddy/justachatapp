import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import {
	Headline,
	Card,
	TextInput,
	Button,
	Caption,
	Checkbox,
	Subheading,
	Text,
	ActivityIndicator
} from 'react-native-paper';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';

import { styles } from './style';

class Register extends React.Component<any, any> {
	constructor(props) {
		super(props);
		{
			this.state = {
				password: '1234567890',
				verifyPassword: '1234567890',
				emailError: false,
				message: null,
				error: false,
				displayNameError: false
			};
		}
	}
	static navigationOptions = { header: null };

	checkValidation = () => {
		this.setState({
			emailError: false,
			message: null,
			error: false,
			displayNameError: false
		});
		let { user } = this.props;
		if (user.email.length === 0 || user.displayName.length === 0) {
			this.setState({
				message: 'All fields are required',
				displayNameError: user.displayName.length === 0,
				emailError: user.email.length === 0
			});
			return false;
		}
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
		let { user, navigation, loading } = this.props;
		if (this.checkValidation()) {
			loading.set(true);
			try {
				await user.createFirebaseUserWithEmailAndPassword(user.email, this.state.password);
				console.log('REGISTRATION COMPLETED ->', this.props.user);
				this.setState({ error: false, emailError: false });
				navigation.navigate('Home');
				loading.set(false);
			} catch (error) {
				console.log('ERROR ->', error);
				this.setState({ error: true, message: error.message });
				loading.set(false);
			}
		}
	};

	render() {
		let { user, navigation, loading } = this.props;
		console.log(toJS(user));
		return (
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled keyboardVerticalOffset={0}>
				<View style={styles.container}>
					<Headline style={styles.title}>Just A Chat App</Headline>
					{loading.state ? (
						<ActivityIndicator size="large" animating={true} />
					) : (
						<View>
							<Card>
								<Card.Title title="Register" />
								<Card.Content>
									<TextInput
										mode="outlined"
										label="Email"
										placeholder="abc@xyz.com"
										onChangeText={(email) => user.setEmail(email)}
										value={user.email}
										error={this.state.emailError || this.state.emailError}
									/>
									<TextInput
										mode="outlined"
										label="Display Name"
										placeholder="Rick"
										onChangeText={(name) => user.setDisplayName(name)}
										value={user.displayName}
										error={this.state.error || this.state.displayNameError}
									/>
									<TextInput
										mode="outlined"
										label="Password"
										placeholder="something secret"
										secureTextEntry={true}
										value={this.state.password}
										onChangeText={(password: string) => this.setState({ password })}
										error={this.state.error}
									/>
									<TextInput
										mode="outlined"
										label="Verify Password"
										placeholder="Make sure it matches"
										secureTextEntry={true}
										value={this.state.verifyPassword}
										onChangeText={(verifyPassword) => this.setState({ verifyPassword })}
										error={this.state.error}
									/>

									<Subheading> GENDER </Subheading>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center'
										}}
									>
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
							{(this.state.error || this.state.emailError || this.state.displayNameError) && (
								<Caption style={styles.errorMessage}>{this.state.message}</Caption>
							)}
							<Caption style={styles.loginCaption} onPress={() => navigation.navigate('Login')}>
								Already a Member? Login
							</Caption>
						</View>
					)}
				</View>
			</KeyboardAvoidingView>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({ user, loading }))(observer(Register));

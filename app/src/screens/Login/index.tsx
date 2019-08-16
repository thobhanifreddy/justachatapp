import React from 'react';
import { View, KeyboardAvoidingView } from 'react-native';
import { Headline, Card, TextInput, Button, Caption } from 'react-native-paper';
import { inject, observer } from 'mobx-react';

import { styles } from './style';

class Login extends React.Component {
	constructor(props) {
		super(props);
	}
	static navigationOptions = { header: null };

	render() {
		return (
			<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled keyboardVerticalOffset={0}>
				<View style={styles.container}>
					<Headline style={styles.title}>Just A Chat App</Headline>
					<Card>
						<Card.Title title="Login" />
						<Card.Content>
							<TextInput mode="outlined" label="Email" placeholder="abc@xyz.com" />
							<TextInput
								mode="outlined"
								label="Password"
								placeholder="something secret"
								secureTextEntry={true}
							/>
						</Card.Content>
						<Card.Actions>
							<Button mode={'contained'} style={styles.LoginButton}>
								Login
							</Button>
						</Card.Actions>
					</Card>
					<Caption style={styles.registerCaption} onPress={() => this.props.navigation.navigate('Register')}>
						Not a Member? Register
					</Caption>
					<Caption style={styles.forgetPasswordCaption} onPress={() => alert('Contact Admin')}>
						Forget Password
					</Caption>
				</View>
			</KeyboardAvoidingView>
		);
	}
}

export default inject((root) => root)(observer(Login));

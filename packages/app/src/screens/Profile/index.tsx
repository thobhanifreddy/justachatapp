import React from 'react';
import {
	Text,
	TextInput,
	ActivityIndicator,
	Card,
	Button,
	Switch,
	IconButton,
	Colors,
	Subheading,
	Checkbox
} from 'react-native-paper';
import { View, Permissions, Dimensions, Image, ScrollView, KeyboardAvoidingView } from 'react-native';
import { inject, observer } from 'mobx-react';
import firebase from 'firebase';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';

import NavBar from '../../components/NavBar/index';
import { styles } from './style';

class Profile extends React.Component<any, any> {
	constructor(props: any) {
		super(props);
		this.state = {
			profilePicture: null
		};
	}
	static navigationOptions = {
		header: <NavBar title="Profile" drawer={true} />
	};

	componentDidMount = async () => {
		this.props.loading.set(true);
		try {
			await this.props.user.get();
			this.props.loading.set(false);
		} catch (error) {
			console.log(error);
			this.props.loading.set(false);
		}
	};

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	};

	_pickImage = async () => {
		this.getPermissionAsync();
		let result: any = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [ 1, 1 ]
		});
		if (!result.cancelled) {
			this.props.user.setPhotoUrl(result.uri);
		}
	};

	uploadImage = async () => {
		const response = await fetch(this.props.user.photoURL);
		const blob = await response.blob();
		let ref = await firebase.storage().ref().child(this.props.user.uid);
		await ref.put(blob);
		let downloadUrl = await ref.getDownloadURL();
		this.props.user.setPhotoUrl(downloadUrl);
		return downloadUrl;
	};

	_handleUplaod = async () => {
		this.props.loading.set(true);
		try {
			await this.uploadImage();
			await this.props.user.update(this.props.user);
			this.props.loading.set(false);
			alert('Profile Updated Successfully');
		} catch (error) {
			console.log(error);
			this.props.loading.set(false);
			alert('There was an error while updating user profile');
		}
	};

	render() {
		let { user, loading } = this.props;
		if (loading.state) {
			return <ActivityIndicator size="large" animating={true} style={styles.loading} />;
		}
		return (
			<ScrollView style={{ flex: 1 }}>
				<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled keyboardVerticalOffset={0}>
					<Card>
						<Card.Content>
							<View>
								<Card.Cover
									style={{ height: Dimensions.get('screen').height / 2.5, resizeMode: 'contain' }}
									source={{
										uri:
											user.photoURL
												? user.photoURL
												: `https://source.unsplash.com/random/300x300/?${user.gender == 'm'
														? 'male'
														: 'female'},face`
									}}
								/>
								<IconButton
									icon="file-upload"
									size={28}
									color={'#6200ee'}
									style={styles.uploadImageIcon}
									onPress={() => this._pickImage()}
								/>
							</View>
						</Card.Content>
						<Card.Content>
							<TextInput mode="outlined" label="Email" disabled value={user.email} />
							<TextInput
								mode="outlined"
								label="Display Name"
								placeholder="Display Name"
								value={user.displayName}
								onChangeText={(name) => user.setDisplayName(name)}
							/>
							<TextInput
								mode="outlined"
								label="Phone Number"
								placeholder="+91-9942404839"
								value={user.phoneNumber}
								onChangeText={(number) => user.setPhoneNumber(number)}
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
							<Button mode="contained" onPress={this._handleUplaod}>
								Update
							</Button>
						</Card.Actions>
					</Card>
				</KeyboardAvoidingView>
			</ScrollView>
		);
	}
}

export default inject(({ appStore: { user, loading } }) => ({ user, loading }))(observer(Profile));

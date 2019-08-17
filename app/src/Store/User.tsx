import { observable, action, computed, runInAction } from 'mobx';
import firebase from 'firebase';

class User {
	@observable uid: string = '';
	@observable email: string = 'abc@xyz.com';
	@observable displayName: string = 'Test';
	@observable photoURL: string = '';
	@observable phoneNumber: string = '';
	@observable gender: string = 'o';
	@observable emailVerified: boolean = false;
	@observable disabled: boolean = false;
	@observable online: boolean = true;

	@action
	setUid = (id: string) => {
		this.uid = id;
	};

	@action
	setEmail = (email: string) => {
		this.email = email;
	};

	@action
	setDisplayName = (name: string) => {
		this.displayName = name;
	};

	@action
	setPhotoUrl = (url: string) => {
		this.photoURL = url;
	};

	@action
	setPhoneNumber = (number: string) => {
		this.phoneNumber = number;
	};

	@action
	setGender = (gender: string) => {
		this.gender = gender;
	};

	@action
	setEmailVerified = (verified: boolean) => {
		this.emailVerified = verified;
	};

	@action
	setDisable = (disabled: boolean) => {
		this.disabled = disabled;
	};

	@action
	setOnline = (online: boolean) => {
		this.online = online;
	};

	@action
	setUser = (user: any) => {
		this.uid = user.uid;
		this.email = user.email;
		this.displayName = user.displayName;
		this.photoURL = user.photoURL;
		this.phoneNumber = user.phoneNumber;
		this.emailVerified = user.emailVerified;
		this.disabled = user.disabled;
		this.online = true;
	};

	@action
	createFirebaseUserWithEmailAndPassword = async (email: string, password: string) => {
		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		await firebase.auth().createUserWithEmailAndPassword(email, password);
		runInAction(async () => {
			let user: any = firebase.auth().currentUser;
			this.uid = user.uid;

			console.log('user to be updated =>', JSON.stringify(user));
			await user.updateProfile({
				displayName: this.displayName,
				gender: this.gender
			});
		});
	};

	@action
	firebaseLogin = async (email: string, password: string) => {
		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		await firebase.auth().signInWithEmailAndPassword(email, password);

		runInAction(() => {
			let user: any = firebase.auth().currentUser;
			this.setUser(user);
		});
	};

	@computed
	get getFirebaseUser() {
		let user: any = firebase.auth().currentUser;
		console.log(user);
		return user;
	}
}

export default User;

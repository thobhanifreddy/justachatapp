import { observable, action, runInAction } from 'mobx';

let firebase: any = {}

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

	constructor(user: any) {
		if (user) {
			this.uid = user.uid;
			this.email = user.email;
			this.displayName = user.displayName;
			this.photoURL = user.photoURL;
			this.phoneNumber = user.phoneNumber;
			this.gender = user.gender;
			this.emailVerified = user.emailVerified;
			this.disabled = user.disabled;
			this.online = user.online;
		}
	}

	@action
	setFirebaseInstance = (instance: any) => {
		firebase = instance;
	};



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
		this.gender = user.gender;
		this.emailVerified = user.emailVerified;
		this.disabled = user.disabled;
		this.online = user.online;
	};

	@action
	get = async () => {
		let currentUser: any = firebase.auth().currentUser;
		console.log(currentUser);
		if (currentUser) {
			let userSnapshot: any = await firebase.database().ref('users/' + currentUser.uid).once('value');
			let dbUser = await userSnapshot.toJSON();
			console.log('DB USER ->', dbUser.phoneNumber);
			let user = { ...dbUser, ...currentUser };
			user.phoneNumber = dbUser.phoneNumber;
			console.log('GET USER -> ', user);
			runInAction(() => {
				this.setUser(user);
			});
		} else {
			throw new Error("User not found")
		}

	};

	@action
	createFirebaseUserWithEmailAndPassword = async (email: string, password: string) => {
		await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		await firebase.auth().createUserWithEmailAndPassword(email, password);
		console.log('user to be updated =>', this.displayName);
		let firebaseUser: any = firebase.auth().currentUser;
		console.log('user to be updated =>', firebaseUser.uid, this.displayName);
		await firebaseUser.updateProfile({
			displayName: this.displayName
		});
		await this.writeUserData(firebaseUser.uid, this.gender, this.phoneNumber, true);
		runInAction(() => {
			this.uid = firebaseUser.uid;
			this.online = true;
		});
	};

	@action
	update = async (user: any) => {
		let firebaseUser = firebase.auth().currentUser;
		if (firebaseUser) {
			await firebaseUser.updateProfile({ displayName: user.displayName, photoURL: user.photoURL });
			await firebase
				.database()
				.ref('users/' + user.uid)
				.set({ gender: user.gender, phoneNumber: user.phoneNumber, online: user.online });
		}
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

	@action
	writeUserData = async (uid: string, gender: string, phoneNumber: string, online: boolean) => {
		console.log('create user with ->', uid, gender, phoneNumber, online);
		var userRef = firebase.database().ref('users/' + uid);
		await userRef.set({ gender, phoneNumber, online });
	};

	@action
	getAll = async () => {
		let users = await fetch("https://us-central1-just-a-chat-app-freddy-ts.cloudfunctions.net/api/Users");
		return users;
	}
}

export default User;

import { observable, action, runInAction } from 'mobx';
import * as admin from 'firebase-admin';

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
	get = async (id: string) => {
		const currentUser: any = admin.auth().getUser(id);
		const userSnapshot: any = await admin.database().ref('users/' + currentUser.uid).once('value');
		const dbUser = await userSnapshot.toJSON();
		console.log('DB USER ->', dbUser.phoneNumber);
		const user = { ...dbUser, ...currentUser };
		// user.phoneNumber = dbUser.phoneNumber;
		console.log('GET USER -> ', user);
		runInAction(() => {
			this.setUser(user);
		});
	};

	@action
	createFirebaseUserWithEmailAndPassword = async (email: string, password: string) => {
		await admin.auth().createUser({
			email: email,
			emailVerified: false,
			phoneNumber: this.phoneNumber,
			password: password,
			displayName: this.displayName,
			photoURL: this.photoURL,
			disabled: false
		});
		// await firebase.auth().createUserWithEmailAndPassword(email, password);
		const firebaseUser: any = await admin.auth().getUserByEmail(email);
		await this.writeUserData(firebaseUser.uid, this.gender, true);
		runInAction(() => {
			this.uid = firebaseUser.uid;
			this.online = true;
		});
	};

	@action
	update = async (user: any) => {
		await admin.auth().updateUser(user.uid, {
			displayName: user.displayName,
			phoneNumber: user.phoneNumber,
			photoURL: user.photoURL
		});
		await admin.database().ref('users/' + user.uid).set({ gender: user.gender, online: user.online });
	};

	// @action
	// firebaseLogin = async (email: string, password: string) => {
	//   // await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);

	// 	await firebase.auth().signInWithEmailAndPassword(email, password);

	// 	runInAction(() => {
	// 		let user: any = firebase.auth().currentUser;
	// 		this.setUser(user);
	// 	});
	// };

	@action
	writeUserData = async (uid: string, gender: string, online: boolean) => {
		console.log('create user with ->', uid, gender, online);
		await admin.database().ref('users/' + uid).set({ gender, online });
	};
}

export default User;

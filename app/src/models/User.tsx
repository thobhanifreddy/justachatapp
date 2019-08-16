import { types, flow } from 'mobx-state-tree';
import firebase from 'firebase';

const User = types
	.model('User', {
		uid: types.optional(types.string, ''),
		email: types.optional(types.string, 'abc@xyz.com'),
		displayName: types.optional(types.string, 'TEST'),
		photoURL: types.optional(types.string, ''),
		phoneNumber: types.optional(types.string, ''),
		gender: types.enumeration([ 'm', 'f', 'o' ]),
		emailVerified: false,
		disabled: false,
		online: false
	})
	.actions((self) => ({
		setUid(uid: string) {
			self.uid = uid;
		},
		setEmail(email: string) {
			self.email = email;
		},
		setDisplayName(name: string) {
			self.displayName = name;
		},
		setPhotoUrl(url: string) {
			self.photoURL = url;
		},
		setPhoneNumber(number: string) {
			self.phoneNumber = number;
		},
		setGender(gender: string) {
			self.gender = gender;
		},
		setEmailVerified(verified: boolean) {
			self.emailVerified = verified;
		},
		setDisable(disabled: boolean) {
			self.disabled = disabled;
		},
		setOnline(online: boolean) {
			self.online = online;
		},
		setUser(user: any) {
			self.uid = user.uid;
			self.email = user.email;
			self.displayName = user.displayName;
			self.photoURL = user.photoURL;
			self.phoneNumber = user.phoneNumber;
			self.emailVerified = user.emailVerified;
			self.disabled = user.disabled;
			self.online = false;
		},
		createUserWithEmailPassword:
			flow(function*(password: string) {
				console.log('creating user');
				yield firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
				console.log('set Persistence');
				const user = yield firebase.auth().createUserWithEmailAndPassword(self.email, password);
				console.log('CREATED USER', user);
				self.uid = user.uid;
				self.email = user.email;
				self.displayName = user.displayName;
				self.photoURL = user.photoURL;
				self.phoneNumber = user.phoneNumber;
				self.emailVerified = user.emailVerified;
				self.disabled = user.disabled;
				console.log('USER UPDATED');
			})
		// async createUserWithEmailPassword(password: string) {
		// 	console.log('creating user');
		// 	await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
		// 	console.log('set Persistence');
		// 	return '123';
		// 	// let user = await firebase.auth().createUserWithEmailAndPassword(self.email, password);
		// 	// return user;
		// }
	}));
// .actions((self) => ({
// 	createUserWithEmailPassword:
// 		flow(function*(email: string, password: string) {
// 			let user = yield firebase.auth().createUserWithEmailAndPassword(email, password);
// 			self.setUser(user);
// 		})
// }));

export default User;

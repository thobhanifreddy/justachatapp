import { observable, action, computed } from 'mobx';
import firebase from "firebase";

import User from 'justachatapp-sdk';
import Loading from './Loading';

let user  = new User(null);
user.setFirebaseInstance(firebase)

class AppStore {
	@observable loading: any = new Loading();
	@observable user: any = user;
}

const store = new AppStore();

export default store;

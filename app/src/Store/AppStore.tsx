import { observable, action, computed } from 'mobx';

import User from './User';
import Loading from './Loading';

class AppStore {
	@observable loading: any = new Loading();
	@observable user: any = new User(null);
}

const store = new AppStore();

export default store;

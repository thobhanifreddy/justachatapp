import { types } from 'mobx-state-tree';

import User from './User';

const AppModel = types
	.model({
		user: User,
		loading: false
	})
	.actions((self) => ({
		setLoading(state: boolean) {
			self.loading = state;
		}
	}));

export default AppModel;

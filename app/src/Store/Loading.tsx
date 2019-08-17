import { observable, action, computed } from 'mobx';

class Loading {
	@observable state: boolean = false;

	@action
	set = (state: boolean) => {
		this.state = state;
	};
}

export default Loading;

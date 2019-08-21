import React from 'react';
import { SafeAreaView } from 'react-native';
import { DrawerActions, withNavigation } from 'react-navigation';
import { Appbar } from 'react-native-paper';

class NavBar extends React.Component<any, any> {
	constructor(props) {
		super(props);
	}
	_goBack = () => {
		console.log(this.props.navigation);
		this.props.navigation.pop();
	};

	render() {
		console.log(this.props);
		return (
			<SafeAreaView style={{ paddingTop: 25 }}>
				<Appbar>
					{this.props.back && <Appbar.BackAction onPress={this._goBack} />}
					<Appbar.Content title={this.props.title} subtitle={this.props.subtitle} />
					{this.props.refresh && <Appbar.Action icon="refresh" onPress={() => this.props.refreshAction()} />}
					{this.props.drawer && (
						<Appbar.Action
							icon="menu"
							onPress={() => this.props.navigation.dispatch(DrawerActions.toggleDrawer())}
						/>
					)}
				</Appbar>
			</SafeAreaView>
		);
	}
}

export default withNavigation(NavBar);

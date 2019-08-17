import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	loading:
		{
			justifyContent: 'center',
			alignSelf: 'center'
		},

	title:
		{
			alignSelf: 'center',
			marginBottom: 50
		},

	container:
		{
			flex: 1,
			justifyContent: 'center'
		},

	registerButton:
		{
			marginTop: 10,
			marginLeft: 5
		},

	loginCaption:
		{
			alignSelf: 'center',
			marginTop: 5
		},

	errorMessage:
		{
			marginTop: 5,
			color: 'red',
			marginLeft: 5
		}
});

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	loading:
		{
			flex: 1,
			justifyContent: 'center',
			alignSelf: 'center'
		},

	container:
		{
			flex: 1,
			justifyContent: 'center'
		},

	title:
		{
			alignSelf: 'center',
			marginBottom: 50
		},

	LoginButton:
		{
			marginTop: 20,
			marginLeft: 8
		},

	registerCaption:
		{
			alignSelf: 'center',
			marginTop: 5
		},

	forgetPasswordCaption:
		{
			alignSelf: 'center'
		},

	errorMessage:
		{
			color: 'red',
			paddingLeft: 3
		}
});

import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import firebase from 'firebase';
import { Provider } from 'mobx-react';

import store from './src/Store/AppStore';

import { config } from './config/firebase';
import Navigation from './config/Navigation';

function App() {
	firebase.initializeApp(config);
	return (
		<PaperProvider>
			<Provider appStore={store}>
				<Navigation />
			</Provider>
		</PaperProvider>
	);
}

export default App;

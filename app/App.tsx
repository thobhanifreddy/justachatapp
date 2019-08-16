import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import firebase from 'firebase';
import { Provider } from 'mobx-react';
import makeInspectable from 'mobx-devtools-mst';
import { onPatch } from 'mobx-state-tree';

import AppModel from './src/models/AppModel';
import User from './src/models/User';

import { config } from './config/firebase';
import Navigation from './config/Navigation';

let user = User.create({ gender: 'o' });
let model = AppModel.create({ user, loading: false });

onPatch(model, (patch) => {
	console.log(patch);
});

makeInspectable(model);

function App() {
	firebase.initializeApp(config);
	return (
		<PaperProvider>
			<Provider appStore={model}>
				<Navigation />
			</Provider>
		</PaperProvider>
	);
}

export default App;

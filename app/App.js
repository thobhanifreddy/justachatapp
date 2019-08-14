import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as ReduxProvider } from "react-redux";
import * as firebase from "firebase";

import Navigation from "./config/Navigation";
import store from "./store";
import { config } from "./config/firebase";

export default function App() {
  firebase.initializeApp(config);
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <Navigation />
      </PaperProvider>
    </ReduxProvider>
  );
}

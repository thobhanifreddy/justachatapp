import { AsyncStorage } from "react-native";

import { LOGIN_USER, LOGOUT_USER } from "./type";

export const loginUser = user => async dispatch => {
  await AsyncStorage.setItem("user", JSON.stringify(user));
  dispatch({ type: LOGIN_USER, payload: user });
};

export const logoutUser = user => async dispatch => {
  await AsyncStorage.removeItem("user");
  dispatch({ type: LOGOUT_USER, payload: user });
};

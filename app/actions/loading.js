import { LOADING } from "./type";

export const handleLoading = state => dispatch => {
  console.log(state);
  dispatch({ type: LOADING, payload: state });
};

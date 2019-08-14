import { LOGIN_USER, LOGOUT_USER } from "../actions/type";

const INITIAL_STATE = {
  user: null
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case LOGIN_USER:
      return action.payload;
    case LOGOUT_USER: {
      return { user: null };
    }
    default:
      return state;
  }
}

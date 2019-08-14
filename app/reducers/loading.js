import { LOADING } from "../actions/type";

const INITAL_STATE = {
  loading: false
};

export default function (state = INITAL_STATE, action) {
  console.log(action);
  switch (action.type) {
    case LOADING:
      return { loading: action.payload };
    default:
      return state;
  }
}

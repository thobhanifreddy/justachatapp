import { UPDATE_UNREAD_MEASSAGES, CLEAR_UNREAD_MEASSAGES } from "../actions/type";

const INITAL_STATE = {

  unreadMessages: []
};

export default function (state = INITAL_STATE, action) {
  switch (action.type) {
    case UPDATE_UNREAD_MEASSAGES:
      return { unreadMessages: state.unreadMessages ? [...state.unreadMessages, action.payload] : [action.payload] };
    case CLEAR_UNREAD_MEASSAGES:
      let unreadMessages = state.unreadMessages.filter(x => !action.payload.filter(y => y.id === x.id).length);
      return { unreadMessages };
    default:
      return state;
  }
}
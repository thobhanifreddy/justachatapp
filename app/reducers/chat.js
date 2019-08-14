import { CHAT_FETCHED, MESSAGE_SENT, MESSAGE_RECEIVED, PUSH_UNREAD_MESSAGE } from "../actions/type";

const INITAL_STATE = {
  messages: [],
  message: null,
  unreadMessages: [],
  fetched: false
};

export default function (state = INITAL_STATE, action) {
  switch (action.type) {
    case CHAT_FETCHED:
      return { messages: action.payload ? action.payload : [], fetched: true };
    case MESSAGE_SENT:
      return { message: action.payload, messages: [...state.messages, action.payload] };
    case MESSAGE_RECEIVED:
      return { message: action.payload, messages: [...state.messages, action.payload] };
    case PUSH_UNREAD_MESSAGE:
      const { idx, user, receiver } = action.payload
      let message = { id: "unread" + idx, type: "unread", user: user, receiver: receiver }
      state.messages.splice(idx, 0, message)
      return { messages: state.messages };
    default:
      return state;
  }
}

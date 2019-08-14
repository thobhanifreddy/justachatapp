import { UPDATE_UNREAD_MEASSAGES, CLEAR_UNREAD_MEASSAGES } from "./type"

export const updateUnreadMessages = (message) => dispatch => {
  dispatch({ type: UPDATE_UNREAD_MEASSAGES, payload: message });
}

export const clearUnreadMessages = (messages) => dispatch => {
  dispatch({ type: CLEAR_UNREAD_MEASSAGES, payload: messages })
}
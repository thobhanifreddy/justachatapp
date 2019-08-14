import { AsyncStorage } from "react-native"
import firebase from "firebase";

import { CHAT_FETCHED, MESSAGE_SENT, MESSAGE_RECEIVED, PUSH_UNREAD_MESSAGE } from "./type"



getChatId = (sid, rid) => {
  if (sid > rid) return sid + rid

  return rid + sid; ``
}


export const initChat = (sender, receiver) => async (dispatch) => {
  try {
    const chatId = getChatId(sender.uid, receiver.uid);
    let snapshot = await firebase.database().ref("chats/" + chatId).once("value")
    chats = await snapshot.val()
    let chatArray = [];
    for (let key in chats) { chatArray = [...chatArray, chats[key]] }
    await AsyncStorage.setItem("chat_" + sender.uid + receiver.id, JSON.stringify(chatArray));
    dispatch({ type: CHAT_FETCHED, payload: chatArray });
  } catch (error) {
    console.log(error);
  }

}

export const sendMessage = (sender, receiver, message) => async (dispatch) => {
  const chatId = getChatId(sender.uid, receiver.uid);

  let messageRef = firebase.database().ref("chats/" + chatId)
  await messageRef.push().set(message);

  dispatch({ type: MESSAGE_SENT, payload: message });
}

export const receiveMessage = (message) => (dispatch) => {
  dispatch({ type: MESSAGE_RECEIVED, payload: message });
}

export const sendMessages = (sender, receiver, messages) => async (dispatch) => {
  const chatId = getChatId(sender.uid, receiver.uid);
  await firebase.database().ref("chats/" + chatId).set(messages)
}

export const pushUnreadMessage = (idx, user, receiver) => dispatch => {
  dispatch({ type: PUSH_UNREAD_MESSAGE, payload: { idx, user, receiver } });


}
import { combineReducers } from "redux";

import auth from "./auth";
import loading from "./loading";
import chat from "./chat"
import unreadChat from "./unreadChat";

export default combineReducers({ auth, loading, chat, unreadChat });

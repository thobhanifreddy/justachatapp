const express = require('express');
const functions = require('firebase-functions');
var admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");


const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://just-a-chat-app-by-freddy.firebaseio.com"
});

const cors = require('cors')({ origin: true });
app.use(cors);

app.get('/users', async (req, res) => {
  let users = await admin.auth().listUsers()
  return res.status(200).send(users);
});

app.post('/chat', async (req, res) => {
  req = JSON.parse(req.body)
  const sender = req.sender;
  const receiver = req.receiver;
  let chat = await admin.database().ref("chats/" + sender.uid + receiver.uid).once("value");
  return res.status(200).send(chat.val());
});

app.post('/sendMessage', async (req, res) => {
  req = JSON.parse(req.body)
  const sender = req.sender.uid;
  const receiver = req.receiver.uid;
  const messages = req.messages;
  let chat = await admin.database().ref("chats/" + sender + receiver).set(messages)
  return res.status(200).send(chat);
});

exports.api = functions.https.onRequest(app);

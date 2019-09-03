import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

import { serviceAccount } from '../serviceAccountKey'
const app: any = express();

const firebaseConfig: any = {};
Object.assign(firebaseConfig, serviceAccount);

admin.initializeApp({ credential: admin.credential.cert(firebaseConfig) });

const cors = require('cors')({ origin: true });
app.use(cors);

app.get('/users', async (req: any, res: any) => {
	const users = await admin.auth().listUsers();
	return res.status(200).send(users);
});

app.get('/user', async (req: any, res: any) => {
	console.log(req);
});

exports.api = functions.https.onRequest(app);

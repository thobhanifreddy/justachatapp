import * as admin from 'firebase-admin';
import * as express from 'express';

import * as serviceAccount from '../serviceAccountKey.json';
const app: any = express();

const firebaseConfig: any = {};
Object.assign(firebaseConfig, serviceAccount);

// firebaseConfig['private_key'] = firebaseConfig['private_key'].replace(/\\n/g, '\n');

// const params = {
// 	type: serviceAccount.type,
// 	projectId: serviceAccount.project_id,
// 	privateKeyId: serviceAccount.private_key_id,
// 	privateKey: serviceAccount.private_key,
// 	clientEmail: serviceAccount.client_email,
// 	clientId: serviceAccount.client_id,
// 	authUri: serviceAccount.auth_uri,
// 	tokenUri: serviceAccount.token_uri,
// 	authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
// 	clientC509CertUrl: serviceAccount.client_x509_cert_url
// };
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

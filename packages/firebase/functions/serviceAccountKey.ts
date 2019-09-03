const dotenv: any = require("dotenv");
dotenv.config();


export const serviceAccount = {
  "type": process.env.type,
  "project_id": process.env.projectId,
  "private_key_id": process.env.privateKeyId,
  "private_key": process.env.privateKey,
  "client_email": process.env.clientEmail,
  "client_id": process.env.clientId,
  "auth_uri": process.env.authUri,
  "token_uri": process.env.tokenUri,
  "auth_provider_x509_cert_url": process.env.authProviderUrl,
  "client_x509_cert_url": process.env.clientUrl,
}

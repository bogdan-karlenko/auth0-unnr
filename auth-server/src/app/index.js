require('dotenv').config();
const express = require('express');
const { unescape } = require('querystring');
const { MongoClient } = require('mongodb');
const { sign } = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { v4: uuid } = require('uuid');
const url = require('url');
const bcrypt = require('bcrypt');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.DB_URI);

const port = 3000;

function decodeAuthCredentials(auth) {
	const clientCredentials = Buffer.from(auth.slice('basic '.length), 'base64')
		.toString()
		.split(':');
	const clientId = unescape(clientCredentials[0]);
	const clientSecret = unescape(clientCredentials[1]);
	return { clientId, clientSecret };
}

mongoClient.connect(async (err, client) => {
	if (err) return console.log(err);
	const db = await client.db('urr-db');

	app.get('/', async (req, res) => {
		const users = await db.collection('users').find().toArray();
		res.send(JSON.stringify(users));
	});

	app.get('/authorize', async (req, res) => {
		const clientId = req.query.client_id;
		const application = await db.collection('applications').findOne({ clientId });
		if (!application) {
			res.status(401).send('Error: application not authorized');
			return;
		}
		if (
			typeof req.query.scope !== 'string'
			// || !containsAll(application.scopes, req.query.scope.split(' '))
		) {
			res.status(401).send('Error: invalid scopes requested');
			return;
		}
		const requestId = uuid();
		await db.collection('requests').insertOne({ requestId, ...req.query });
		res.redirect(`http://localhost:3001/permission?c=${clientId}&r=${requestId}`);
	});

	app.post('/approve', async (req, res) => {
		const { userName, password, requestId } = req.body;
		const user = userName && await db.collection('users').findOne({ username: userName });
		console.log('user:', user);
		if (!user || !bcrypt.compare(password, user.password)) {
			res.status(401).send('Error: user not authorized');
			return;
		}
		const clientReq = await db.collection('requests').findOne({ requestId }, { projection: { _id: 0 } });
		console.log(clientReq);
		if (!clientReq) {
			res.status(401).send('Error: invalid user request');
			return;
		}
		db.collection('requests').deleteOne({ requestId });
		const code = uuid();
		await db.collection('auth-requests').insertOne({ code, clientReq, userName });
		const redirectUri = url.parse(clientReq.redirect_uri);
		redirectUri.query = {
			code,
			state: clientReq.state,
		};
		res.redirect(url.format(redirectUri));
	});

	app.post('/token', async (req, res) => {
		const collection = db.collection('auth-requests');
		const authCredentials = req.headers.authorization;
		if (!authCredentials) {
			res.status(401).send('Error: not authorized');
			return;
		}
		const { clientId, clientSecret } = decodeAuthCredentials(authCredentials);
		const application = await db.collection('applications').findOne({ clientId });
		if (!application || application.clientSecret !== clientSecret) {
			res.status(401).send('Error: client not authorized');
			return;
		}
		const { code } = req.body;
		const request = code && await collection.findOne({ code });
		if (!request) {
			res.status(401).send('Error: invalid code');
			return;
		}
		const { clientReq, userName } = request;
		collection.deleteOne({ code });
		const token = sign(
			{
				userName,
				scope: clientReq.scope,
			},
			'securesecret',
		);
		res.json({
			access_token: token,
			token_type: 'Bearer',
			scope: clientReq.scope,
		});
	});

	return app.listen(port, () => {
		console.log('Server is listening on port', port);
	});
});

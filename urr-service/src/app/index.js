require('dotenv').config();
const express = require('express');
// const { unescape } = require('querystring');
const { MongoClient } = require('mongodb');
const { verify } = require('jsonwebtoken');
const bodyParser = require('body-parser');
// const { v4: uuid } = require('uuid');
// const url = require('url');
// const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.DB_URI);

const port = 3004;

// function decodeAuthCredentials(auth) {
// 	const clientCredentials = Buffer.from(auth.slice('basic '.length), 'base64')
// 		.toString()
// 		.split(':');
// 	const clientId = unescape(clientCredentials[0]);
// 	const clientSecret = unescape(clientCredentials[1]);
// 	return { clientId, clientSecret };
// }

mongoClient.connect(async (err, client) => {
	if (err) return console.log(err);
	// const db = await client.db('urr-db');

	app.get('/', async (req, res) => {
		res.send('urr-service is up');
	});

	app.get('/info', (req, res) => {
		console.log(req.headers);
		if (!req.headers.authorization) {
			res.status(401).send('Error: client unauthorized');
			return;
		}

		const authToken = req.headers.authorization.slice('bearer '.length);
		let userInfo = null;
		try {
			userInfo = verify(authToken);
		} catch (e) {
			res.status(401).send('Error: client unauthorized');
			return;
		}
		if (!userInfo) {
			res.status(401).send('Error: client unauthorized');
			return;
		}
		console.log(userInfo);
		// const user = users[userInfo.userName];
		// const userWithRestrictedFields = {};
		// const scope = userInfo.scope.split(' ');
		// for (let i = 0; i < scope.length; i++) {
		// 	const field = scope[i].slice('permission:'.length);
		// 	userWithRestrictedFields[field] = user[field];
		// }

		// res.json(userWithRestrictedFields);
		res.json({ fake: 'info' });
	});

	return app.listen(port, () => {
		console.log('urr-service is listening on port', port);
	});
});

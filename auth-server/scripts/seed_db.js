require('dotenv').config();
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient('mongodb://admin:password@localhost:27017');

const clientId = 'bbd10678-a71c-45d7-a6d3-6029b1c48b1e';

mongoClient.connect(async (err, client) => {
	if (err) return console.log(err);
	console.log('connected to DB');
	const db = await client.db('urr-db');

	const application = await db.collection('applications').findOne({ clientId });
	const adminUser = await db.collection('users').findOne({ username: 'admin' });
	const testerUser = await db.collection('users').findOne({ username: 'tester' });

	await Promise.all([
		!application && db.collection('applications').insertOne({
			clientName: 'UrrApp',
			clientId,
			clientSecret: '0yAwgWZzlW',
		}).then(() => console.log('UrrApp application created')),
		!adminUser && db.collection('users').insertOne({
			username: 'admin',
			password: await bcrypt.hash('adminPass', 10),
			roleName: 'admin',
		}).then(() => console.log('Admin user created')),
		!testerUser && db.collection('users').insertOne({
			username: 'tester',
			password: await bcrypt.hash('userPass', 10),
			roleName: 'user',
		}).then(() => console.log('Tester user created')),
	]);
	console.log('All done!');
	return process.exit(0);
});

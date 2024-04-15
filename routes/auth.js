const express = require('express');
// const { GridFSBucket, ObjectId } = require('mongodb');
const router = express.Router();


router.post('/signin', async (req, res) => {
	const database = req.db;
	const user = req.body;
	const users = database.collection('users');
	const query = { username: user.username, password: user.password };
	const foundUser = await users.findOne(query);
	if (foundUser) {
		// send a token session user + 1 random number from 1 - 9
		const token = foundUser.username + Math.floor(Math.random() * 9 + 1);
		res.status(200).send({ token: token });
	} else if (!foundUser) {
		res.status(404).send({ message: 'Invalid credentials' });
	} else {
		res.status(400).send({ message: 'Service down' });
	}
});

module.exports = router;

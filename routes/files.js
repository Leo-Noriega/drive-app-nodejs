const express = require('express');
const { GridFSBucket, ObjectId } = require('mongodb');
const router = express.Router();


router.post('/upload', async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send('No files were uploaded.');
	}

	const database = req.db;
	const file = req.files.archivo;
	const bucket = new GridFSBucket(database, { bucketName: 'bucket' });

	const uploadStream = bucket.openUploadStream(file.name, { chunkSizeBytes: 1048576, metadata: { field: 'contentType', value: file.mimetype } });
	const buffer = file.data;

	uploadStream.write(buffer);
	uploadStream.end();

	uploadStream.on('finish', () => {
		res.send(`File uploaded with id ${uploadStream.id}`);
	});
});

router.get('/download/:id', async (req, res) => {
	const id = req.params.id;
	const database = req.db;
	const bucket = new GridFSBucket(database, { bucketName: 'bucket' });
	const file = {
		name: "",
		contentType: ""
	}
	const cursor = bucket.find({ _id: new ObjectId(id) });
	await cursor.forEach(doc => {
		file.name = doc.filename;
		file.contentType = doc.metadata.value;
	});

	const downloadStream = bucket.openDownloadStream(new ObjectId(id));

	downloadStream.on('error', (err) => {
		return res.status(404).send('File not found');
	});

	res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
	res.setHeader('Content-Type', file.contentType); // 'application/octet-stream'
	downloadStream.pipe(res);

	downloadStream.on('end', () => {
	});
});

router.get('/getFiles', async (req, res) => {
	const database = req.db;
	const bucket = new GridFSBucket(database, { bucketName: 'bucket' });
	const files = await bucket.find({}).toArray();
	res.send(files);
  });

module.exports = router;
const proxy = require('express-http-proxy');
const express = require('express');

const imageStore = require('./image-store');

// router
const router = express.Router();

//Imgur routes
router.post('/api/image-upload/url', imageStore.upload);
router.post('/api/image-upload/file', imageStore.uploadFromLocal);

// Yoruichi Route
router.post('/yri-graphql', proxy('http://localhost:9933/yri-graphql'));

module.exports = router;

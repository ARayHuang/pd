const path = require('path');
const express = require('express');
const router = new express.Router();

router.get(/^\//, function (req, res) {
	res.sendFile(path.resolve('public', 'client-app.html'));
});

module.exports = router;

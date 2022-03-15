
const express = require('express');
const router = express.Router();
const path = require('path');

// main page
router.get('/test', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../../client/myapp/public/index.html'));
});

module.exports = router;
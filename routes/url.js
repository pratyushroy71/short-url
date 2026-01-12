const express = require('express');
const {generateNewShortUrl, handleGetAnal} = require("../controllers/url");
const router = express.Router();

router.post('/', generateNewShortUrl);

router.get('/analytics/:shortId' , handleGetAnal)

module.exports = router;
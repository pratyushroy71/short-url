const shortid = require('short-id');
const URL = require('../models/url');

async function generateNewShortUrl(req, res) {
    if (!req.body || !req.body.url) {
        return res.status(400).json({ error: "url is required" });
    }

    const shortId  = shortid.generate();

    await URL.create({
        shortId,
        redirectURL: req.body.url,
        visitHistory: [],
    });

    return res.json({ shortId  });
}

async function handleGetAnal
    (req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId })
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    generateNewShortUrl
    , handleGetAnal
};

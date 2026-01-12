const express = require("express");
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require("./connect");
const URL = require('./models/url');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url');

app.use(express.json());


app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    try {
        const { shortId } = req.params;

        const entry = await URL.findOneAndUpdate(
            { shortId },
            {
                $push: {
                    visitHistory: { timestamp: Date.now() },
                },
            },
            { new: true }
        );

        if (!entry) {
            return res.status(404).json({ error: "Short URL not found" });
        }

        let redirectURL = entry.redirectURL;

        // 🔴 Fix missing protocol
        if (!/^https?:\/\//i.test(redirectURL)) {
            redirectURL = 'https://' + redirectURL;
        }

        return res.redirect(redirectURL);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


app.listen(PORT, () => console.log('Server started'));

const express = require("express");
const path = require("path");
const staticRouter = require("./routes/staticRouter");
const urlRoute = require('./routes/url');
const { connectToMongoDB } = require("./connect");
const URL = require('./models/url');
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/short-url');

app.set("view engine" , "ejs");
app.set('views' , path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/test' , async(req, res) => {
    const allUrls = await URL.find({});
    return res.render('home',{
        urls: allUrls,
         host: req.headers.host
    });
});


app.use("/url", urlRoute);

//app.use("/", staticRouter);




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

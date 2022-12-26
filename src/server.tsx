import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const upload = multer();
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

const port = 3000;

app.get("/index.js", (req, res) => {
    res.sendFile(path.join(__dirname, "/www/index.js"));
});

app.get("/api/cookie/:value/", (req, res) => {
    const name = "csrftoken";
    const value = req.params.value;
    console.log(`Setting cookie "${name}" to "${req.params.value}"`);
    res.cookie(name, value);
    res.json({cookie: "was set"});
});

app.get("/api/read-cookie/", (req, res) => {
    const headerCount = req.rawHeaders.filter(header => header == "Cookie").length;
    console.log("RAW HEADERS, NOTICE DUPLICATE Cookie", req.rawHeaders);
    console.log("COOKIES", req.cookies);

    res.json({headerCount});
});

app.listen(port, () => {
    console.log(`Test app listening on port ${port}`);
});

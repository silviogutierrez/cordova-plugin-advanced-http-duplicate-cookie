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

app.post("/api/set-cookie/:name/:value/", (req, res) => {
    const name = req.params.name;
    const value = req.params.value;
    console.log(`Setting cookie "${name}" to "${value}"`);
    res.cookie(name, value);
    res.json({cookie: "was set"});
});

app.post("/api/read-cookie/:name/", (req, res) => {
    const name = req.params.name;
    const headerCount = req.rawHeaders.filter(header => header == "Cookie").length;
    console.log("RAW HEADERS, NOTICE DUPLICATE Cookie", req.rawHeaders);
    console.log("COOKIES", req.cookies);

    res.json({headerCount, [name]: req.cookies[name]});
});

app.listen(port, () => {
    console.log(`Test app listening on port ${port}`);
});

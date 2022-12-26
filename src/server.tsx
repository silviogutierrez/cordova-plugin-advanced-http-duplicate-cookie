import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import multer from "multer";

const app = express();
const upload = multer();
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/www/index.html"));
});

app.get("/index.js", (req, res) => {
    res.sendFile(path.join(__dirname, "/www/index.js"));
});

app.post("/api/body/", (req, res) => {
    res.json(req.body);
});

app.get("/api/simple/", (req, res) => {
    res.json({thisThing: "Works"});
});

app.get("/api/headers/", (req, res) => {
    res.json({header: req.headers["x-some-header"]});
});

app.post("/api/multipart/", upload.none(), (req, res) => {
    res.json({result: req.body.doesthiswork});
});

app.get("/api/text/", (req, res) => {
    res.json(
        "I am text, content type should not take precendece over calling response.text()",
    );
});

app.get("/api/number/", (req, res) => {
    res.json(5);
});

app.get("/api/string/", (req, res) => {
    res.json("a string");
});

app.get("/api/null/", (req, res) => {
    res.json(null);
});

app.get("/api/true/", (req, res) => {
    res.json(true);
});

app.get("/api/false/", (req, res) => {
    res.json(false);
});

app.get("/api/cookie/:value/", (req, res) => {
    const name = "csrftoken";
    const value = req.params.value;
    console.log(`Setting cookie "${name}" to "${req.params.value}"`);
    res.cookie(name, value);
    res.json({cookie: "was set"});
});

app.get("/api/read-cookie/:cookieName/", (req, res) => {
    console.log(req.rawHeaders);
    res.json({value: req.cookies[req.params.cookieName]});
});

app.get("/api/blob/", (req, res) => {
    res.sendFile(path.join(__dirname, "/www/cat.jpeg"));
});

app.get("/api/400/", (req, res) => {
    res.status(400).json({thisField: "is required"});
});

app.listen(port, () => {
    console.log(`Test app listening on port ${port}`);
});

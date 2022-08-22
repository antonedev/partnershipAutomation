const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.get("/bex/create", (req, res) => {
    let first = req.query["firstName"];
    let last = req.query["lastName"];
    res.json({ firstName: first, lastName: last });
})

app.listen(9000);

//testing
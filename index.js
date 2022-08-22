const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.get("/bex/create", (req, res) => {
    let query = req.query.name;
    res.json({ response: query });
})

app.listen(9000);

//testing
const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.get("/bex/create", (req, res) => {
    res.json({ response: "Ready" });
})

app.listen(9000);
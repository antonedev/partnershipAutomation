const puppeteer = require("puppeteer");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.get("/bex/create", (req, res) => {
    let firstName = req.query["firstName"];
    let lastName = req.query["lastName"];
    if (!firstName || !lastName) return res.json({ error: "First and last name must be provided." });
    res.json({ firstName: firstName, lastName: lastName });
})

app.listen(9000);

//testing
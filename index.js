const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.post("/bex/create-agent", (req, res) => {
    let firstName = req.body["firstName"];
    let lastName = req.body["lastName"];
    if (!firstName || !lastName) return res.json({ error: "First and last name must be provided." });
    res.json({ firstName: firstName, lastName: lastName });
})

app.listen(9000);
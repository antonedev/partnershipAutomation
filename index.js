const e = require("express");
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.listen(9000, (e) => {
    console.log(e);
});

//testing reset123456789
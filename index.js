require("dotenv").config();
const nodemailer = require("nodemailer");
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({ response: "B-OK" });
})

app.post("/bex/create-agent", (req, res) => {
    if (!req.headers.authorization) return res.status(402).json({ Error: "Authorization header is required" });
    if (req.headers.authorization != process.env.AUTHORIZATION) return res.status(402).json({ Error: "Authroization invalid" });
    if (!req.body["firstName"] || !req.body["lastName"]) return res.status(400).json({ Error: "firstName and lastName are required." });
    if (!req.body["notificationEmail"]) return res.status(400).json({ Error: "notificationEmail is required." })

    let notificationEmail = req.body["notificationEmail"];
    let firstName = req.body["firstName"];
    let lastName = req.body["lastName"];
    res.status(202).json({ firstName: firstName, lastName: lastName });
    console.log(`New Request: ${firstName} ${lastName}\nNotification Email: ${notificationEmail}`);

    createAgent(firstName, lastName, notificationEmail);
})

app.listen(9000);

async function createAgent(firstName, lastName, notificationEmail) {
    console.log(`createAgent running!`);
    const browser = await puppeteer.launch({ executablePath: "/usr/bin/chromium", headless: true });
    const page = await browser.newPage();
    console.log(`Browser opened`);
    await page.setDefaultNavigationTimeout(0);
    await page.goto("https://app.mailparser.io/account/login", {
        waitUntil: 'domcontentloaded'
    });
    console.log(`Loaded ${page.url()}`);
    await page.type("#email", process.env.MP_ACCT);
    await page.type("#password", process.env.MP_PASS);
    await page.click("#start-free-sub");
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    console.log(`Loaded ${page.url()}`);
    await page.click("#dashboard_inbox_add");
    await page.type("input[name='label']", `${firstName} ${lastName}`);
    await page.select("select[name='inbox_category_id']", "3015");
    await page.click("#btn_add_address_save");
    await page.waitForNavigation({ waitUntil: "load" });
    console.log(`Loaded ${page.url()}`);
    const address = await page.$eval("a.created_inbox_link", anchor => anchor.textContent);
    const transporter = await nodemailer.createTransport({
        host: process.env.MX_HOST,
        port: process.env.MX_PORT,
        secure: false,
        auth: {
            user: process.env.MX_ACCT,
            pass: process.env.MX_PASS,
        },
    });
    await transporter.sendMail({
        from: "'Automation Testing' <automation@antone.dev>",
        to: address,
        subject: "Automation Testing",
        text: `First Name: Test
        Last Name: Person
        Type: Purchase
        Property: https://www.bexrealty.com/Arizona/Tucson/133-E-Horizon-Cir/condominium/
        Property Address: 123 TEST CIR
        City: TUCSON
        State: AZ
        Zip: 85737
        MLS: 1234567
        Phone: (858) 123-4567
        Email: testlead@test.com
        Development: Horizon Heights Condominiums
        Price: $299,900
        Source: BEX Realty
        Partner Agent: Test Man`,
    });
    await page.waitForSelector("#done_wrapper", {
        visible: true,
    });
    await page.click("#done_wrapper > div > a");
    await page.waitForSelector("#wizard_save", { visible: true });
    console.log(`Loaded ${page.url()}`);
    await page.click("#wizard_save");
    await page.waitForNavigation({ waitUntil: "domcontentloaded" });
    console.log(`Loaded ${page.url()}`);
    const inboxURL = page.url();
    const notificationTransporter = await nodemailer.createTransport({
        host: process.env.MX_HOST,
        port: process.env.MX_PORT,
        secure: false,
        auth: {
            user: process.env.MX_ACCT,
            pass: process.env.MX_PASS,
        },
    });
    await notificationTransporter.sendMail({
        from: "'Verse Partnership Automation' <automation@antone.dev>",
        to: notificationEmail,
        subject: `BEX Parser created for ${firstName} ${lastName}`,
        text: `A new Mailparser inbox has been created for ${firstName} ${lastName}!
        Inbox URL: ${inboxURL}
        Mailparser Address: ${address}`,
    });
    await browser.close();
    console.log(`Browser closed`);
}
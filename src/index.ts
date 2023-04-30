import express from 'express';
import Reply from "./classes/Reply/Reply.js";
import fs from "fs";
import RequiredProperties from "./util/RequiredProperties.js";

const pjson = JSON.parse(fs.readFileSync("package.json").toString());
const ejson = JSON.parse(fs.readFileSync("environment.json").toString());

export { pjson, ejson }

const app = express();

// Set up body parsers
app.use(express.json())

// Set up custom middleware
app.use((req, res, next) => {
    // Allow CORS usage
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*")
    res.header("Access-Control-Allow-Methods", "*")

    // Define reply method, to set status code accordingly
    res.reply = (reply) => {
        res.status(reply.request.status_code).json(reply);
    }

    // Continue
    next();
})

// Set up locals
app.locals.pjson = pjson;
app.locals.ejson = ejson;

app.get("/", async (req, res) => {
    res.reply(new Reply({
        response: {
            message: "OK",
            version: pjson.version,
            env: ejson
        }}));
})

app.post("/", RequiredProperties([
    "one",
    {property: "two"},
    {property: "three", optional: true},
    {property: "four", optional: true, isArray: true},
    {property: "five", min: 0, max: 5},
    {property: "six", minLength: 2, maxLength: 5},
    {property: "seven", trim: true, minLength: 2, maxLength: 5},
    {property: "eight", enum: ["one", "two", "three"]},
    {property: "nine", regex: /^[a-zA-Z]+$/},
    {property: "ten", custom: (value) => { return {pass: value == "ten", reason: "Meow the cat ate your request :3"} }}
]), async (req, res) => {
    res.reply(new Reply({
        response: {
            message: "OK",
            version: pjson.version,
            env: ejson
        }}));
})

app.all("*", async (req, res) => {
    res.reply(new Reply({
        responseCode: 404,
        success: false,
        response: {
            message: "Not found"
        }}));
})

app.listen(process.env.PORT || 13717, () => {
    console.log("Listening on port 13717");
})
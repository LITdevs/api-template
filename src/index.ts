import express from 'express';
import Reply from "./classes/Reply/Reply.js";
import fs from "fs";

const pjson = JSON.parse(fs.readFileSync("package.json").toString());
const ejson = JSON.parse(fs.readFileSync("environment.json").toString());

export { pjson, ejson }

const app = express();

app.get("/", async (req, res) => {
    res.json(new Reply(
        {
            response: {
                message: "OK",
                version: pjson.version,
                env: ejson
            }
        }));
})

app.listen(process.env.PORT || 13717, () => {
    console.log("Listening on port 13717");
})
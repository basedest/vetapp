import express from "express";
import { json } from "body-parser";
import cors from "cors";

const app = express();
app.use(json(), cors());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
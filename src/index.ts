import express from "express";
import pkg from "body-parser";
import cors from "cors";
import userRouter from "./router/UserRouter";
import branchRouter from "./router/BranchRouter";
import employeeRouter from "./router/EmployeeRouter";
import visitRouter from "./router/VisitRouter";
import clientRouter from "./router/ClientRouter";

const {json} = pkg;

const app = express();
app.use(json(), cors());

process.on("uncaughtException", (err:Error) =>{
    console.error(err);
});

app.get("/", (req, res) => {
    res.json({message: "Hello world"});
});

app.use(userRouter);
app.use(branchRouter);
app.use(employeeRouter);
app.use(visitRouter);
app.use(clientRouter);

const port = 3000;

app.listen(port, () => {
    console.log("Server started on port " + port);
});
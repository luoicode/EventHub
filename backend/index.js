/** @format */
const express = require("express");
const cors = require("cors");
const authRouter = require("./src/routers/authRouter");
const connectDB = require("./src/configs/ConnectDb");
const errorMiddlewareHandler = require("./src/middlewares/errorMiddleware");
const userRouter = require("./src/routers/userRouter");
const { verification } = require("./src/controllers/authController");
const verifyToken = require("./src/middlewares/verifyMidlleware");
const app = express();
require("dotenv").config;

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.use("/auth", authRouter);
app.use('/users', verifyToken, userRouter);

connectDB();

app.use(errorMiddlewareHandler);

app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Server starting at http://localhost:${PORT}`);
});

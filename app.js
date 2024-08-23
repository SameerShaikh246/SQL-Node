require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./route/authRoute");

const app = express();

app.use(express.json());

app.get("/", function (req, res) {
  res.status(200).json({
    status: "success",
    message: "APIs are working properly.",
  });
});

// routes

app.use("/api/v1/auth", authRouter);

app.use("*", function (req, res) {
  res.status(400).json({
    status: "request failed",
    message: "Route not found",
  });
});

const PORT = process.env.APP_PORT || 4000;

app.listen(PORT, () => {
  console.log("server listening on port", PORT);
});

const express = require("express");
const dbConnection = require("./config/db");
dbConnection.connection();
const apiRoute = require("./routes/index");
const errorHandler = require("./middlewares/error.handler");
const cors = require("cors");

const app = express();
// const port = process.env.PORT || 3000;

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    // origin: allowedOrigins,
    origin: "*",
  })
);

// API routes
app.use("/api/v1/", apiRoute);

app.use(errorHandler);

module.exports = app;

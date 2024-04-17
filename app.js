const express = require("express");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { connect } = require("./config/db-connection");
const cors = require("cors");

const app = express();

app.use(cors());
app.options('*', cors());

const fileRouter = require("./routes/files");
const userRouter = require("./routes/auth");




app.use(fileUpload());
app.use(express.json());

app.use(async (req, res, next) => {
  req.db = await connect();
  next();
});

app.use("/files", fileRouter);
app.use("/auth", userRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server listening on port 3000");
});

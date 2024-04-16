const express = require("express");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const { connect } = require("./config/db-connection");
const cors = require("cors");

const fileRouter = require("./routes/files");
const userRouter = require("./routes/auth");

const app = express();
//admitir todos los origenes
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(fileUpload());
app.use(express.json());

app.use(async (req, res, next) => {
  req.db = await connect();
  next();
});

app.use("/files", fileRouter);
app.use("/auth", userRouter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
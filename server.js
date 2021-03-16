const express = require("express");
const mongo = require("mongoose");
const cors = require('cors');
const authRouter = require('./routes/auth-routes');

const app = express();

// connect to mongo db atlas server
const dbUrl =
  "mongodb+srv://root:root@nodecourse.m9pux.mongodb.net/nodecourse?retryWrites=true&w=majority";
mongo
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => app.listen(3000))
  .catch((err) => console.log("connection to database failed: ", err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ status: 'ok', data: 'welcome to our api, though this should be a restricted page' });
});

app.get("/blog", (req, res) => {
  res.send({ status: 'ok', data: [{ _id: "34s3434sdg9sdsdsaz", title: "Blog 1", description: "hello to our blog." }] });
});

app.use(authRouter);

app.use((req, res) => {
  res.status(404).send({ status: 'error', data: "no entry found." });
});

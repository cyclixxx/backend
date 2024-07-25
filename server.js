const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const routeManager = require('./routes/route.manager.js')
const { createsocket } = require("./socket/index.js");
const { createServer } = require("node:http");

require("dotenv").config();
// // ============ Initilize the app ========================
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true , limit: '50mb'}));
app.use(cors());

const server = createServer(app);
async function main() {
  createsocket(server);
}
main();

// application routes
routeManager(app)

app.get("/", (req, res) => {
  res.send("Welcome to cyclix backend server");
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).json({
      status: false,
      code  : 500,
      error : `Can't find ${err.stack}`
  });
});

// 404 handler
app.use(function (req, res, next) {
  res.status(404).json({
      status: false,
      code  : 404,
      error : `Can't find ${req.originalUrl}`
  });
});
mongoose.set('strictQuery', false);
// const dbUri = "mongodb+srv://cyclixgamesdev:WR1gmj3ScmZZh6vV@cluster0.asnhbpn.mongodb.net/cygcasstest?retryWrites=true&w=majority&appName=Cluster0"
const dbUri = `mongodb+srv://highscoreteh:eNiIQbm4ZMSor8VL@cluster0.xmpkpjc.mongodb.net/cyclix?retryWrites=true&w=majority`
// const dbUri = `mongodb://localhost:27017/cass`;
mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000  })
  .then((result) => console.log('Database connected'))
  .catch((err) => console.log("Database failed to connect"))
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log("Running on port " + PORT);
});
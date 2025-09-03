const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require('express');
const mongoose = require("mongoose"); // require package

const app = express();

// database setup
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status (optional)
const db = mongoose.connection
db.on('error', (err) => {console.log('ERROR: ', err)})
mongoose.connection.on("connected", () => {     // log connection status to terminal on start
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
// disconnect
db.on('disconnected', () => {console.log('mongo disconnected')})

// Import the Fruit model
const Fruit = require("./models/fruit.js");

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/fruits/new", (req, res) => {
  res.send("This route sends the user a form page!");
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

require('dotenv').config();
console.log(process.env);

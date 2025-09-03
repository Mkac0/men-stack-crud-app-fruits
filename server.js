const express = require('express');
const app = express();

require('dotenv').config(); // Loads the environment variables from .env file
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose"); // require package

// --- DB ---
// Connect to MongoDB using the connection string in the .env file
mongoose.connect(process.env.MONGODB_URI);
// log connection status (optional)
const db = mongoose.connection
db.on('error', (err) => {console.log('ERROR: ', err)}) 
db.on('connected', () => {console.log(`Connected to MongoDB ${mongoose.connection.name}.`)})
db.on('disconnected', () => {console.log('mongo disconnected')})

// --- Models ---
const Fruit = require("./models/fruit.js");

// MIDDLEWARE - if "false" we use querystring library (basic objects)
app.use(express.urlencoded({ extended: false }));

// --- Routes ---
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs"); // Instead of res.send, let’s render the new.ejs template we just created in the views/fruit directory
});

// POST /fruits
app.post("/fruits", async (req, res) => {
  try {
    req.body.isReadyToEat = req.body.isReadyToEat === "on";
    await Fruit.create(req.body);
    res.redirect("/fruits/new"); // redirect to the route, not the file
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to create fruit");
  }
});

// --- Server/Listener ---
app.listen(3000, () => {
  console.log('Listening on port 3000');
});

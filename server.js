const express = require('express');
const app = express();

require('dotenv').config(); // Loads the environment variables from .env file
const PORT = process.env.PORT || 3000;

const mongoose = require("mongoose"); // require package
const methodOverride = require("method-override"); // new
const morgan = require("morgan"); //new

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
app.use(methodOverride("_method")); // new
app.use(morgan("dev")); //new

// --- Routes ---
app.get("/", async (req, res) => {
    res.render("index.ejs");
});

// GET /fruits
app.get("/fruits", async (req, res) => {
    const allFruits = await Fruit.find();
    res.render("fruits/index.ejs", { fruits: allFruits });
});

app.get("/fruits/new", (req, res) => {
  res.render("fruits/new.ejs"); // Instead of res.send, let’s render the new.ejs template we just created in the views/fruit directory
});

app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { fruit: foundFruit });
});

app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
});

// GET localhost:3000/fruits/:fruitId/edit
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", {
        fruit: foundFruit,
    });
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
    res.redirect("/fruits"); // redirect to index fruits
});

// --- Server/Listener ---
app.listen(3000, () => {
    console.log('Listening on port 3000');
});

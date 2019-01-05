const mongoose = require("mongoose");
const express = require("express");
const app = express();
const morgan = require("morgan");
const { urlencoded, json } = require("body-parser");
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  body: {
    type: String,
    minlength: 10
  }
});

const Note = mongoose.model("note", noteSchema);
app.use(morgan("dev"));
app.use(urlencoded({ extended: true }));
app.use(json());

app.get("/note", async (req, res) => {
  const notes = await Note.find({})
    // For Skip-based pagination
    // .sort()
    // .skip(10)
    // .limit(10)
    // For getting the pure based json not the mongoose object
    .lean()
    .exec();

  res.status(200).json(notes);
});

app.post("/note", async (req, res) => {
  const noteToBeCreated = req.body;
  const note = await Note.create(noteToBeCreated);

  res.status(201).json(note.toJSON());
});

const connect = () => mongoose.connect("mongodb://localhost:27017/whatver");

connect()
  .then(async connection => {
    app.listen(5000);
  })
  .catch(e => console.error(e));

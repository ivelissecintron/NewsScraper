var mongoose = require("mongoose");

//saving a reference to the schema constructor
var Schema = mongoose.Schema;

//creating a new Noteschema object 
var NoteSchema = new Schema({
    title: String,
    body: String
});

//creating model from the schema
var Note = mongoose.model("Note", NoteSchema);

//exporting the Note model
module.exports = Note;
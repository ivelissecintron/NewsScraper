var mongoose = require("mongoose");

//schema constructor
var Schema = mongoose.Schema;

//creating a new schema object
var ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

//creating model 
var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
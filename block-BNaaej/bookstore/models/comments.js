let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let commentSchema = new Schema({
    title: {type: String, required: true},
    author: String,
    bookId: {type:Schema.Types.ObjectId, ref: "Book", required: true}
}, {timestamps: true});

module.exports = mongoose.model("Comment", commentSchema);
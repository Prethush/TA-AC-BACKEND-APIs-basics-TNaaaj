let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let stateSchema = new Schema({
    name: {type: String, required: true},
    country: {type: Schema.Types.ObjectId, ref: "Country", required: true},
    population: Number,
    area: Number,
    neighbour: [{type: Schema.Types.ObjectId, ref: "State"}]
}, {timestamps: true});

module.exports = mongoose.model("State", stateSchema);
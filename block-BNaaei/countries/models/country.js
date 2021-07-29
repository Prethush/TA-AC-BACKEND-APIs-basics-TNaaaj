let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let countrySchema = new Schema({
    name: {type: String, required: true},
    states: [{type: Schema.Types.ObjectId, ref: "State"}],
    continent: String, 
    population: Number,
    ethnicity: [String],
    neighbours: [{type: Schema.Types.ObjectId, ref: "Country"}],
    area: Number 
}, {timestamps: true});

countrySchema.index({name: 1});

module.exports = mongoose.model("Country", countrySchema);
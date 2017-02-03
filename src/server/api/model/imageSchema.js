const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var imageSchema = new Schema({
    originalName: {type: String, required: true},
    pathToImage: {type: String, required: true},
    pathToPartOne: {type: String, required: true},
    pathToPartTwo: {type: String, required: true},
    pathToPartThree: {type: String, required: false},
    pathToMontage: {type: String, required: false},
    description: {type: String, required: true}
});

module.exports = mongoose.model('Image', imageSchema);



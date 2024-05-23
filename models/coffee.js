const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const Coffee = mongoose.model('Coffee', coffeeSchema);

module.exports = Coffee;
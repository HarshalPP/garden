const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NewSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String, // Change the data type to String
        required: true
    }
});

const datamodel = mongoose.model('UserRegister', NewSchema);

module.exports = datamodel;

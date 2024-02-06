const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    password: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema);
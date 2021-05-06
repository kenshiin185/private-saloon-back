const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user: { type: String, required:true},
    image: { type : String, required:true},
    password: {type: String, required:true},
    createdOn: {type:Date, default: Date.now}
});

module.exports = mongoose.model('User',userSchema);
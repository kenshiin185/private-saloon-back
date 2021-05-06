const mongoose = require('mongoose');

const msgpostSchema = new mongoose.Schema({
    user: String,
    content:String,
    image:String,
    createdOn: { type:Date, default:Date.now }
});
module.exports = mongoose.model('MsgPost',msgpostSchema );
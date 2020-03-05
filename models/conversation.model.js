const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
    path: {type: [Number]},
}, { timestamps: true });

module.exports = mongoose.model('Conversation', conversationSchema);

// src/models/message.js
const mongoose = require('mongoose');

const editHistorySchema = new mongoose.Schema({
    editedAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    }
});

const messageSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    editHistory: [editHistorySchema]
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

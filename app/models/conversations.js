const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Conversations = new Schema({

    message_id: {
        type: String,
        index: true
    },
    platform: {
        type: String,
        index: true,
        enum: [
            "messenger",
            "instagram",
            "whatsapp"
        ]
    },
    sender_id: {
        type: String,
        index: true
    },
    receiver_id: {
        type: String,
        index: true
    },
    platform_msg_id: {
        type: String,
        index: true
    },
    conversation_type: {
        type: String,
        enum: [
            "user_message",
            "bot_message"
        ]
    },
    text: {
        type: String
    }
})


module.exports = mongoose.model('Conversations', Conversations, 'conversations');

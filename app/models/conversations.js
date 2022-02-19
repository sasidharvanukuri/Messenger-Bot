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
            "user_messages",
            "bot_messages"
        ]
    },
    convo_text: {
        type: String
    }
})


mongoose.model('Conversations', Conversations, 'conversations');

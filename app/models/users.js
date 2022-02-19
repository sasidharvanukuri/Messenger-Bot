const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = new Schema({

    user_id: {
        type: String,
        index: true
    },
    messenger_sender_id: {
        type: String,
        index: true
    },
    name: {
        type: String
    },
    dob: {
        type: String
    }
})


mongoose.model('Users', Users, 'users');

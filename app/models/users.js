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
    },
    user_journey_completed: {
        type: Boolean,
        default:false
    }
})


module.exports = mongoose.model('Users', Users, 'users');

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserJourneyProgress = new Schema({

    sender_id: {
        type: String
    },
    current_journey_id: {
        type: Number
    },
    is_final: {
        type: Boolean,
        default: false
    },
    journies: {
        type: Array,
        fields: [
            {
                journey_id: {
                    type: Number
                },
                message_sent:{
                    type:Boolean,
                    default:false
                },
                user_replied:{
                    type:Boolean,
                    default:false
                }
            }
        ]
    },
})


module.exports = mongoose.model('UserJourneyProgress', UserJourneyProgress, 'user_journey_progress');

`use strict`;
const request = require('request');
const Messenger = require('../messenger/messenger');
const Coversations = require('../../models/conversations');
const Users = require('../../models/users');
const UserJourneyProgress = require('../../models/user-journey-progress');
const Jounrney = require('../../models/user-journey-definitions');
const uuid = require('uuid').v4;
const _ = require('lodash');
/**
 * @class EvenHandler
 * @link https://github.com/fbsamples/messenger-platform-samples/blob/main/node/app.js
 */
class EventHandler {
    constructor() {

    }
    async handleMessage(webhook_event) {

        let message_object = flattenEventObject(webhook_event)

        handleUserJourney()

    }

    async handleUserJourney(message_object) {
        try {

            let user = await this.handleUserDetails(message_object)
            let jounrney = await this.handleJourney(user)
           
        } catch (e) {
            console.error(e)
        }
    }

    async handleJourney(user){
        let current_journey;
        if(user.new_user == true){
            let journies = []
            for(let each in Jounrney){
                let object = {}
                object["journey_id"] = each["journey"]
            }
            let create_object = {
                "sender_id": user.messenger_sender_id,
                "current_journey_id" : 1,
                "journies": journies
            }

            let user_progress = await UserJourneyProgress.create(create_object);

            

        }else if(user.user_data.user_journey_completed){


        }

    }

    async handleUserDetails(message_object) {
        try {
            let user = await Users.findOne({ "messenger_sender_id": message_object.sender_id })
            if (user) {
                return {
                    "new_user": false,
                    "user_data": user
                }
            } else {
                let createdUser = await Users.create({
                    "user_id": uuid(),
                    "messenger_sender_id": message_object.sender_id
                })
                return {
                    "new_user": true,
                    "user_data": createdUser
                }
            }
        } catch (e) {
            console.log('ERROR: While handling user')
            console.error(e)
            throw e
        }
    }

    async storeUserConversation(data) {
        try {
            let createdConvo = await Coversations.create({
                "message_id": uuid(),
                "platform": "messenger",
                "sender_id": data.sender_id,
                "receiver_id": data.receiver_id,
                "platform_msg_id": "user_message",
                "text": data.text,
                "message_time_stamp": data.time
            })
            return createdConvo
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    flattenEventObject(webhook_event) {
        let object = {}
        object["sender_id"] = webhook_event.sender.id
        object["recipient_id"] = webhook_event.recipient.id
        object["message_id"] = webhook_event.message.mid
        object["text"] = webhook_event.message.text
        object["time"] = new Date(webhook_event.timestamp)
        return object

    }

    // handlePostback(senderPsid, receivedPostback) {
    //     console.log(receivedPostback)
    //     let response;
    //     let payload = receivedPostback.payload;
    //     if (payload === '3.yes') {
    //         response = { 'text': 'Thanks!' };
    //     } else if (payload === '3.no') {
    //         response = { 'text': 'Oops, try sending another image.' };
    //     }
    //     this.callSendAPI(senderPsid, response);
    // }

    callSendAPI(senderPsid, response) {
        const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_TOKEN;
        let requestBody = {
            'recipient': {
                'id': senderPsid
            },
            'message': response
        };
        request({
            'uri': 'https://graph.facebook.com/v13.0/me/messages',
            'qs': { 'access_token': PAGE_ACCESS_TOKEN },
            'method': 'POST',
            'json': requestBody
        }, (err, _res, _body) => {
            if (!err) {
                console.log(_body)
                console.log('Message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        });
    }
}


module.exports = new EventHandler()
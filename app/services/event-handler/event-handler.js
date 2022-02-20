`use strict`;

const Messenger = require('../messenger/messenger');
const Coversations = require('../../models/conversations');
const Users = require('../../models/users');
const UserJourneyProgress = require('../../models/user-journey-progress');
const Journey = require('../../models/user-journey-definitions');
const Moment = require('moment')
const uuid = require('uuid').v4;
const _ = require('lodash');

const MODELS = {
    "Users": Users
}

/**
 * @class EvenHandler
 * @link https://github.com/fbsamples/messenger-platform-samples/blob/main/node/app.js
 */
class EventHandler {

    constructor() {

    }

    async handleMessage(webhook_event) {
        try {
            let event = this.flattenEventObject(webhook_event)
            let convo = await this.storeUserConversation(event)
            let user = await this.handleUserDetails(event);
            let journey = await this.getJourneyDetails(user);
            let data = await this.journeyHandler(journey, event, user);
            console.log(data)
            return data
        }
        catch (e) {
            //!!!!!!!
            console.error(e)
        }
    }

    async journeyHandler(journey, event, user) {
        if (journey.handle) {
            await this.execJourney(journey, event, user)
        } else {
            return Promise.resolve({ "status": true, message: "User journey completed." })
        }
    }

    async execJourney(journey, event, user) {
        let journey_object = journey["journey"]
        let progress_object = _.find(journey["progress_object"]["journies"], {
            "journey_id": journey_object["journey"]
        })
        if (progress_object.message_sent == true && progress_object.user_replied == false) {
            if (journey_object.on_reply.type == "model") {
                let model = journey_object.on_reply.model
                let query = this.objectBuilder(event, journey_object.on_reply.query)
                let data = this.objectBuilder(event, journey_object.on_reply.data_mapping)
                let res = await this.execModel(model, query, data)
                let progress_update_data = {
                    "sender_id": event.sender_id,
                    "journey_id": journey_object["journey"],
                    "new_journey_id": (journey_object.is_last) ? journey_object["journey"] : journey_object["journey"] + 1
                }
                if (journey_object.is_last) {
                    console.log("Came to last")
                    progress_update_data["is_final"] = true
                }
                let new_progress = await this.updateReceivedProgress(progress_update_data)
                if (journey_object.send_next == true) {
                    // * Need to be careful - Recurrsion.
                    let new_journey = this.getNextJourney(new_progress);
                    console.log(new_journey)
                    return await this.execJourney(new_journey, event)
                } else {
                    return {
                        "status": true,
                        "message": "No journey"
                    }
                }
            }
            if (event.quick_reply && journey_object.on_reply.type == "self") {
                let progress_update_data = {
                    "sender_id": event.sender_id,
                    "journey_id": journey_object["journey"],
                    "new_journey_id": (journey_object.is_last) ? journey_object["journey"] : journey_object["journey"] + 1
                }
                if (journey_object.is_last) {
                    console.log("Came to last")
                    progress_update_data["is_final"] = true
                }
                let new_progress = await this.updateReceivedProgress(progress_update_data)
                if (event.quick_reply in journey_object.on_reply) {
                    let action_object = journey_object["on_reply"][event.quick_reply]
                    if (action_object.type == "handler") {
                        let output = this[action_object.handler](user)
                        let handler_date = this.objectBuilder(output, action_object.data_mapping);
                        if (action_object.return_type) {
                            let msg = await Messenger.sendTextMessage(event, handler_date.text)
                            let bot_convo = await this.storeBotConversation(msg)
                            let user_journey_completed = await Users.findOneAndUpdate({ "user_id": user.user_data.user_id },
                                {
                                    user_journey_completed: true
                                })
                            return {
                                "status": true,
                                "message": "Handled"
                            }
                        } else {
                            console.log("No return type")
                            return {
                                "status": false,
                                "message": "No handler"
                            }
                        }
                    } else if (action_object.type == "text") {
                        let msg = await Messenger.sendTextMessage(event, action_object.text)
                        let bot_convo = await this.storeBotConversation(msg)
                        let user_journey_completed = await Users.findOneAndUpdate({ "user_id": user.user_data.user_id },
                            {
                                user_journey_completed: true
                            })
                        return {
                            "status": true,
                            "message": "Handled"
                        }
                    } else {
                        console.log("No action type");
                        return {
                            "status": false,
                            "message": "No handler"
                        }
                    }
                } else {
                    return {
                        "status": true,
                        "message": "Unknown Quick Reply"
                    }
                }

            }
        } else if (progress_object.message_sent == false) {
            // * send message and update message_sent as true
            if (journey_object.type == "text") {
                let msg = await Messenger.sendTextMessage(event, journey_object.text)
                let bot_convo = await this.storeBotConversation(msg)
                let new_progress = await this.updateSentProgress({
                    "sender_id": event.sender_id,
                    "journey_id": journey_object["journey"]
                })
                return {
                    "status": true,
                    "message": "Text Message Sent"
                }
            } else if (journey_object.type == "quick_reply") {
                let msg = await Messenger.sendQuickMessage(event, journey_object)
                let bot_convo = await this.storeBotConversation(msg)
                let new_progress = await this.updateSentProgress({
                    "sender_id": event.sender_id,
                    "journey_id": journey_object["journey"]
                })
                return {
                    "status": true,
                    "message": "Quick Message Sent"
                }
            } else {
                return Promise.resolve({ "status": true })
            }
        } else {
            console.log("No Journey to move next")
        }
    }

    sendUserDOBInDays(user) {
        console.log(user)
        let DOB = Moment(user.user_data.dob)
        console.log(DOB)
        let TODAY = Moment().startOf('day')
        let yearValid = DOB.isBefore(TODAY, 'year')
        let days;
        if (yearValid) {
            if (DOB.isLeapYear() && DOB.month() + 1 == 2 && DOB.date == 29) {
                return {
                    "data": "You are leaping!!!!!"
                }
            } else {
                let THIS_YEAR_DOB = Moment(`${TODAY.year()}-${DOB.month() + 1}-${DOB.date()}`)
                let NEXT_YEAR_DOB = Moment(`${TODAY.year() + 1}-${TODAY.month() + 1}-${TODAY.date()}`)
                if (THIS_YEAR_DOB.diff(TODAY, "days") == 0) {
                    days = 0
                } else if (THIS_YEAR_DOB.diff(TODAY, "days") < 0) {
                    days = NEXT_YEAR_DOB.diff(TODAY, "days")
                    console.log(days)
                } else {
                    days = THIS_YEAR_DOB.diff(TODAY, "days")
                    console.log(days)
                }
            }
            if (days == 0) {
                return {
                    "data": "Happy Birthday 🥳 "
                }
            } else {
                return {
                    "data": `There are ${days} days left until your next birthday`
                }
            }
        } else {
            return {
                "data": "This is not right !! 🤔 "
            }
        }
    }


    getNextJourney(progress) {
        // TODO - More conditions check
        // TODO - data base query for consistency
        let object = {
            "journey": Journey[progress.current_journey_id],
            "progress_object": progress
        }
        return JSON.parse(JSON.stringify(object))
    }


    async updateReceivedProgress(data) {
        console.log(data)
        try {
            let res = await UserJourneyProgress.findOneAndUpdate(
                { "sender_id": data.sender_id, "journies.journey_id": data.journey_id },
                {
                    "$set": {
                        'journies.$.user_replied': true,
                        "current_journey_id": data.new_journey_id,
                        "is_final": data.is_final || false
                    }
                }
            ).lean()
            return JSON.parse(JSON.stringify(res))
        } catch (e) {
            console.log("ERROR: While updating received progress")
            console.error(e)
            throw e
        }
    }

    async updateSentProgress(data) {
        try {
            let res = await UserJourneyProgress.findOneAndUpdate(
                { "sender_id": data.sender_id, "journies.journey_id": data.journey_id },
                {
                    "$set": {
                        'journies.$.message_sent': true
                    }
                }
            ).lean()
            return JSON.parse(JSON.stringify(res))
        } catch (e) {
            console.log("ERROR: While updating sent progress")
            console.error(e)
            throw e
        }
    }

    async storeBotConversation(data) {
        try {
            let createdConvo = await Coversations.create({
                "message_id": uuid(),
                "platform": "messenger",
                "sender_id": data.sender_id,
                "receiver_id": data.recipient_id,
                "conversation_type": "bot_message",
                "platform_msg_id": data.message_id,
                "text": data.text,
                "message_time_stamp": data.time
            })
            return createdConvo
        } catch (e) {
            console.error(e)
            throw e
        }
    }


    async execModel(model_name, query, data) {
        try {
            console.log(query, data
            )
            let res = await MODELS[model_name].findOneAndUpdate(query, data)
            return JSON.parse(JSON.stringify(res))
        } catch (e) {
            console.log('ERROR: While ExecModel')
            throw e
        }
    }

    objectBuilder(event, object) {
        let data = {}
        let input = { "event": event }
        for (let each in object) {
            if (object[each]["type"] == "dynamic") {
                data[each] = _.get(input, object[each]["value"])
            } else {
                data[each] = object[each][value]
            }
        }
        return data
    }

    async getJourneyDetails(user) {
        try {
            if (user.new_user == true) {
                let journies = []
                for (let each of Journey) {
                    let object = {}
                    object["journey_id"] = each["journey"]
                    object["message_sent"] = false
                    object["user_replied"] = false
                    journies.push(object)
                }
                let create_object = {
                    "sender_id": user.user_data.messenger_sender_id,
                    "current_journey_id": 1,
                    "journies": journies
                }
                console.log(create_object)
                let user_progress = await UserJourneyProgress.create(create_object)
                user_progress = JSON.parse(JSON.stringify(user_progress))
                return {
                    "handle": true,
                    "journey": Journey[0],
                    "progress_object": user_progress
                }
            } else if (user.user_data.user_journey_completed == false) {
                console.log({
                    "sender_id": user.user_data.messenger_sender_id,
                })
                let user_progress = await UserJourneyProgress.findOne({
                    "sender_id": user.user_data.messenger_sender_id,
                }).lean()
                console.log(user_progress, user_progress.current_journey_id)
                return {
                    "handle": true,
                    "journey": Journey[user_progress.current_journey_id - 1],
                    "progress_object": user_progress
                }
            } else {
                return Promise.resolve({ "status": true, "message": "Journey Completed" })
            }
        }
        catch (e) {
            console.log("ERROR: While fetching user progress")
            console.error(e)
            throw e
        }
    }

    async handleUserDetails(message_object) {
        try {
            let user = await Users.findOne({ "messenger_sender_id": message_object.sender_id }).lean()
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
                "receiver_id": data.recipient_id,
                "conversation_type": "user_message",
                "platform_msg_id": data.message_id,
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
        if (webhook_event.message.quick_reply) {
            object["quick_reply"] = _.get(webhook_event, "message.quick_reply.payload")
        }
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

}


module.exports = new EventHandler()
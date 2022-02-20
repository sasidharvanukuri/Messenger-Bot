`use strict`;

const { sendRequest } = require('../../utils/api-request-sender');
class Messenger {


    async sendTextMessage(event, text) {
        let options = this.buildTextMessagePayload(event, text)
        try {
            let res = await sendRequest(options)
            return {
                "recipient_id": res.recipient_id,
                "message_id": res.message_id,
                "text": text,
                "sender_id": event.recipient_id,
                "time": new Date().toISOString
            }
        } catch (e) {
            console.log("ERROR: While handling text msg")
            console.error(e)
            throw e
        }
    }


    buildTextMessagePayload(event, text) {
        const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_TOKEN; // TODO
        let requestBody = {
            'recipient': {
                'id': event.sender_id
            },
            'message': {
                'text': text
            }
        };
        let options = {
            'uri': 'https://graph.facebook.com/v13.0/me/messages',
            'qs': { 'access_token': PAGE_ACCESS_TOKEN },
            'method': 'POST',
            'body': requestBody,
            "json": true
        }

        return options
    }

    async sendQuickMessage(event, journey_object) {
        let options = this.buildQuickMessagePayload(event, journey_object)
        try {
            let res = await sendRequest(options)
            return {
                "recipient_id": res.recipient_id,
                "message_id": res.message_id,
                "text": journey_object.text,
                "sender_id": event.recipient_id,
                "time": new Date().toISOString
            }
        } catch (e) {
            console.log("ERROR: While handling text msg")
            console.error(e)
            throw e
        }
    }

    buildQuickMessagePayload(event, journey_object) {
        const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_TOKEN; // TODO
        let requestBody = {}
        requestBody["recipient"] = {
            "id": event.sender_id
        }
        requestBody["message"] = {}
        requestBody["message"]["quick_replies"] = []
        requestBody["message"]["text"] = journey_object.text
        for (let each of journey_object.values) {
            let object = {
                "content_type": "text",
                "title": each,
                "payload": `${journey_object.journey}.${each}`,
                "image_url": ""
            }
            requestBody["message"]["quick_replies"].push(object)
        }
        let options = {
            'uri': 'https://graph.facebook.com/v13.0/me/messages',
            'qs': { 'access_token': PAGE_ACCESS_TOKEN },
            'method': 'POST',
            'body': requestBody,
            "json": true
        }
        return options
    }

    handleEdgeCase(sender_psid, received_message) {

    }
}

module.exports = new Messenger()
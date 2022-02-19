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

    sendQuickMessage() {

    }

    buildQuickMessagePayload() {
        response = {

            "text": "Do you want to know how many days left till your next birhtday",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "3.yes",
                    "image_url": ""
                }, {
                    "content_type": "text",
                    "title": "No",
                    "payload": "3.no",
                    "image_url": ""
                }
            ]

        }
    }

    handleEdgeCase(sender_psid, received_message) {

    }
}

module.exports = new Messenger()
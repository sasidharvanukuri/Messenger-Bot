`use strict`;
const request = require('request');
const Messenger = require('../messenger/messenger');
/**
 * @class EvenHandler
 * @link https://github.com/fbsamples/messenger-platform-samples/blob/main/node/app.js
 */
class EventHandler {
    async handleMessage(webhook_event) {

        let message_object = flattenEventObject(webhook_event)
        await recordMessage(message_object)

       
    }

    flattenEventObject(webhook_event){
        let object = {}
        object["sender_id"] = webhook_event.sender.id
        object["recipient_id"] = webhook_event.recipient.id
        object["message_id"] = webhook_event.message.mid
        object["text"] = webhook_event.message.text
       
    }

    handlePostback(senderPsid, receivedPostback) {
        console.log(receivedPostback)
        let response;
        let payload = receivedPostback.payload;
        if (payload === '3.yes') {
            response = { 'text': 'Thanks!' };
        } else if (payload === '3.no') {
            response = { 'text': 'Oops, try sending another image.' };
        }
        this.callSendAPI(senderPsid, response);
    }

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
`use strict`;

const Response = require('../../utils/response-builder');
const { verifySignature } = require('../../utils/verify-signature');
const EventHandler = require('../event-handler');
const Binder = require('auto-bind');
const { response } = require('express');


/**
 * @author @sasidharvanukuri sasidhar vanukuri
 * @class Webhooks
 * @description Handles Webhooks
 * Taken refernce from 
 * @link https://github.com/fbsamples/messenger-platform-samples/blob/main/quick-start/app.js
 */
class Webhooks {

    constructor() {
        Binder(this)
    }

    /**
     * @method verifyWebhook
     * @description The following method verifies webhook verfication request from Deveoper portal
     * @param {*} qyery_data 
     * @returns Handles response
     */
    verifyWebhook(qyery_data) {
        try {
            let response = new Response()
            let VERIFY_TOKEN = "one2three4"
            let mode = qyery_data['hub.mode'];
            let token = qyery_data['hub.verify_token'];
            let challenge = qyery_data['hub.challenge'];
            console.log(challenge)
            if (mode && token) {
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                    console.info('Webhook verified');
                    response.statusCode(200)
                    response.setData(challenge)
                } else {
                    console.info("Webhook verification failed")
                    response.statusCode(403);
                }
            }
            return response.send()
        } catch (e) {
            console.error(e)
            throw e
        } finally {
            console.info("Method invokation completed")
        }
    }

    /**
     * @method handleWebhook
     * @param {*} body_data 
     * @param {*} headers 
     * @param {*} raw_body 
     * @returns 
     */
    async handleWebhook(body_data, headers, raw_body) {
        try {
            let response = new Response()
            if (verifySignature(headers, raw_body)) {
                let response = new Response()
                if (body_data.object === 'page') {
                    await this.handleEvents(body_data)
                    return response.statusCode(200).setData("Event Received").send();
                } else {
                    return response.statusCode(404).send()
                }
            } else {
                return response.statusCode(200).send()
            }
        } catch (e) {
            console.error(e)
            // TODO handling
            return response.statusCode(500).send()
        }
    }

    /**
     * 
     * @method handleEvents
     * @param {Object} body_data 
     * @link https://developers.facebook.com/docs/messenger-platform/reference/webhook-events
     * @description Handles Subscribed event's
     */
    handleEvents(body_data) {
        let promises = []
        body_data.entry.forEach(function (entry) {
            let webhook_event = entry.messaging[0];
            let sender_psid = webhook_event.sender.id;
            console.info('Sender PSID: ' + sender_psid);
            console.info(webhook_event)
            if (webhook_event.message && webhook_event.message.quick_reply == undefined) {
                promises.push(
                    EventHandler.handleMessage(webhook_event)
                )
            }else if(webhook_event.message && webhook_event.message.quick_reply != undefined){
                promises.push(
                    EventHandler.handleQuickReply(webhook_event)
                )
            } else if (webhook_event.postback) {
                promises.push(
                    EventHandler.handlePostback(webhook_event)
                )
            } else if (webhook_event.optin) {
                console.log("Optin Event")
            } else if (webhook_event.delivery) {
                console.log("Delivery Event")
            } else if (webhook_event.read) {
                console.log("Optin Event")
            } else {
                console.info("Unknown Event", body_data)
            }
        })
        return Promise.all(promises).then(res=>{
            return true
        }).catch(e=>{
            console.error(e)
            throw new Error("Event Handling Failed")
        })
    }


}


module.exports = new Webhooks()
`use strict`;
/**
 * @author sasidhar vanukuri
 * @file webhooks.js
 */
const router = require('express').Router();
const Webhooks = require('../services/webhooks');
const Handler = require('../utils/request-handler');
const SendResponse = require('../utils/respone-handler');


/**
 * GET /webhook
 * @description To handle facebook authorisation to the webhook.
 * Its only to authorise webhook - No specific use case
 */
router.get('/webhook',
     (req, res, next) => {
        let exec = Handler(Webhooks.verifyWebhook, req.query)
        exec(req, res, next)
    },
    SendResponse
)

/**
 * POST /webhook
 * @description After successful authorisation of GET webhook,
 * Facebook will send subscribed event data to POST Api 
 *  
 */
router.post('/webhook',
    (req, res, next) => { 
        let exec = Handler(Webhooks.handleWebhook, req.body, req.headers, req.raw_body)
        exec(req, res, next)
    },
    SendResponse
)

module.exports = router;
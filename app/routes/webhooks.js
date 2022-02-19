`use strict`;

const router = require('express').Router();
const Webhooks = require('../services/webhooks');
const Handler = require('../utils/request-handler');
const SendResponse = require('../utils/respone-handler');

router.get('/webhook',
     (req, res, next) => {
        let exec = Handler(Webhooks.verifyWebhook, req.query)
        exec(req, res, next)
    },
    SendResponse
)

router.post('/webhook',
    (req, res, next) => {
        let exec = Handler(Webhooks.handleWebhook, req.body, req.headers, req.raw_body)
        exec(req, res, next)
    },
    SendResponse
)

module.exports = router;
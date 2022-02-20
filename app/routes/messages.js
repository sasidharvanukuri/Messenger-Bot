`use strict`;
/**
 * @author sasidhar vanukuri
 * @file messages.js
 */
const router = require('express').Router();
const Messages = require('../services/messages');
const Handler = require('../utils/request-handler');
const SendResponse = require('../utils/respone-handler');

router.get('/messages',
     (req, res, next) => {
        let exec = Handler(Messages.getUserMessages, req.query)
        exec(req, res, next)
    },
    SendResponse
)

router.get('/messages/:id',
    (req, res, next) => { 
        let exec = Handler(Messages.getMessage, req.params)
        exec(req, res, next)
    },
    SendResponse
)

router.get('/summary',
    (req, res, next) => { 
        let exec = Handler(Messages.usersMessageSummary, req.query)
        exec(req, res, next)
    },
    SendResponse
)

module.exports = router;
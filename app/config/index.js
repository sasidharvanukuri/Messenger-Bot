`use strict`;


const Confidence = require('confidence')

const criteria = {
    env: process.env.NODE_ENV
}

const config = {
    "project":"Messenger Bot",
    "description": "Messenger webhooks, User conversation and replies.",
    "environment" : {"$env": "NODE_ENV"},
    "app":{
        "$filter": { "$env": "NODE_ENV" },
        "production":{
            "page_token":{ "$env": "NODE_ENV" }
        },
        "$default":{

        }
    }
}

const store = new Confidence.Store(config)

exports.get = function (key) {
    return store.get(key, criteria)
}

exports.meta = function (key) {
    return store.meta(key, criteria)
}
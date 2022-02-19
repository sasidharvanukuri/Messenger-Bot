'use strict';
const debug = require('debug')('messenger-bot:server')
const mongoose = require('mongoose');
const options = { keepAlive: 1, connectTimeoutMS: 3000, useNewUrlParser: true, useUnifiedTopology: true };
const url = "mongodb://localhost:27017/MessengerBot"
mongoose.connect(url, options)
let mongo = mongoose.connection
mongo.on('open', () => {
    debug('Connected to database...!')
})
mongo.on('disconnected', () => {
    debug('Database server disconnected...!')
})
mongo.on('reconnected', () => {
    debug('Trying to reconnect with database')
})
mongo.on('error', (error) => {
    console.error('\n\nDatabase connection Error', error)
    console.info("\n\nShutdowning the server, Please validate env")
    process.exit(1)
})
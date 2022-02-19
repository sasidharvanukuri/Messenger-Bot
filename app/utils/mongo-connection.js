'use strict';

const mongoose = require('mongoose');
const options = { keepAlive: 1, connectTimeoutMS: 3000, useNewUrlParser: true, useUnifiedTopology: true };
const url = "mongodb://localhost:27017/MessengerBot"
mongoose.connect(url, options)
let mongo = mongoose.connection
console.info("Connecting to database...!")
mongo.on('open', () => {
    console.info('Database connected...!')
})
mongo.on('disconnected', () => {
    console.error('Database server disconnected...!')
})
mongo.on('reconnected', () => {
    console.info('Trying to reconnect with database')
})
mongo.on('error', (error) => {
    console.error('\n\nDatabase connection Error', error)
    console.info("\n\nShutdowning the server, Please validate env")
    process.exit(1)
})
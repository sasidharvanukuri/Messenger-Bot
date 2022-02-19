`use strict`;
const Request = require('request-promise');

/**
 * 
 * @param {Object} options 
 * @returns Request Body
 */
module.exports.sendRequest = function (options) {

    return Request(options).then(data => {
        //TODO : Handling responses and etc.
        return data
    }).catch(e => {
        console.error(e);
        throw new Error("API_REQUEST_ERROR")
    })
}
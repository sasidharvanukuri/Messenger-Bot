const e = require("express");

/**
 * @file response_builder.js
 * @author @sasidharvanukuri sasidhar vanukuri
 * @date Feb,18 2022  
 * @class Builder
 * @description The Class <Builder> enables custome methods to set and get HTTP response.
 * 
 */
`use strict`;


/**
 * @class Builder
 */
class Builder {

    constructor() {
        this.http = {}
        this.headers = {}
        this.data = null
        this.others = {}
    }

    /**
     * @method statusCode
     * @param {Number} status_code 
     * @description The following method set http status code to current context
     */
    statusCode(status_code) {
        this.http.status_code = Number(status_code) || 200
        return this
    }

    /**
     * @method setHeader
     * @param {String} head_name 
     * @param {String} header_value 
     * @description The method store header objects to current context
     */
    setHeader(header_name, header_value) {
        if (typeof header_name == "string" && typeof header_value == "string"){
            this.headers[header_name] = header_value
        }else{
            throw new Error("Header Name and Value shoule be of type string")
        }
       
    }

    /**
     * @method setData
     * @param {*} data 
     * @description This methods store http response body
     */
    setData(data) {
        // if(typeof data != "object"){
        //     throw new Error("Send only JS Object response, Other type are not allowed")
        // }
        this["data"] = data || undefined;
        return this
    }

    /**
     * @method set
     * @param {String} key 
     * @param {*} value 
     * @description Its a low level method for <Builder.data>
     */
    set(key, value) {
        if (typeof key == "string") {
            this["others"][key] = value
            return this
        } else {
            throw new Error('Key of unknown type')
        }
    }

    /**
     * @method send
     * @returns Response promise object
     * @description The final method to create and alter the object
     */
    send() {
        this.parse_response = true
        return Promise.resolve(this, null)
    }
}

module.exports = Builder;
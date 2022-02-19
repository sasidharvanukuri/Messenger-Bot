`use strict`;

/**
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} next - Express next middleware
 */
module.exports = function (req, res, next) {

    let locals = res.locals
    let status = 200
    let response_body = undefined
    if (locals.parse === true) {
        if (typeof locals.data == "object" && (locals.data != null || locals.others !=null)) {
            response_body = {}
            Object.assign(response_body, locals.data, locals.others)
        } else {
            response_body = locals.data
        }
        if (locals.http) {
            let http = locals.http
            if (http.status_code) {
                status = http.status_code
            }
        }
        if (locals.headers) {
            let headers = locals.headers;
            for (let each in headers) {
                res.setHeader(each, headers[each])
            }
        }
        return res.status(status).send(response_body)
    }
    if (locals.error === true) {

    }

    if(locals.method_data){
        return res.status(status).send(locals.method_data)
    }

    // THis is the last Middleware - But beaware
    next()


}
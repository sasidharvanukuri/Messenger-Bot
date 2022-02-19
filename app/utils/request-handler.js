`use strict`;

/**
 * 
 * @param {*} method 
 * @param  {...any} args 
 * @returns None
 * @description Request Handler middleware
 * Used currying and JS first class object function
 */
module.exports = function (method, ...args) {
    return function (req, res, next) {
        
        if (!res.locals) {
            res.locals = {}
            res.locals.data = undefined
        }
        method(...args).then((data, error)=>{
            if(data.parse_response == true){
                res.locals.parse = true
                delete parse_response
                Object.assign(res.locals, data)
            } else if (data) {
                res.locals.method_data = data
            } else {
                res.locals.data = data || "No response from the API"
            }
            next()
        }).catch(e=>{
            console.error(e)
            res.locals.error = true
            next()
        })
    }
} 
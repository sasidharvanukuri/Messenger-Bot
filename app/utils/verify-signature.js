const crypto = require('crypto');

module.exports.verifySignature = function (headers, data) {
    const signature = headers["x-hub-signature"];
    if (!signature) {
        console.error("Event Message Signature Not Found");
        console.error("Might be Ingestion - !!!!Intrusion!!!!")
    } else {
        let elements = signature.split('=');
        let method = elements[0];
        let signatureHash = elements[1];
        let expectedHash = crypto.createHmac('sha1', process.env.APP_SECRET)
            .update(data)
            .digest('hex');
        if (signatureHash != expectedHash) {
            console.info("Event Signature verification Failed")
            return false
        }
        console.info("Signature Verified")
        return true
    }
}
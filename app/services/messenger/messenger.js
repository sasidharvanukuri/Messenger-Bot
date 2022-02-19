`use strict`;

class Messenger {


    handleConversation(sender_psid, received_message) {
        try {
            if (receivedMessage.text) {

            } else {
                this.handleEdgeCase()
            }
        } catch (e) {
            console.error(e)
        }
    }

    sendTextMessage() {

    }

    buildTextMessagePayload() {
        response = {
            'text': "Attachment feature is not supported 😔"
        };
    }

    sendQuickMessage() {

    }

    buildQuickMessagePayload() {
        response = {

            "text": "Do you want to know how many days left till your next birhtday",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "Yes",
                    "payload": "3.yes",
                    "image_url": ""
                }, {
                    "content_type": "text",
                    "title": "No",
                    "payload": "3.no",
                    "image_url": ""
                }
            ]

        }
    }

    handleEdgeCase(sender_psid, received_message) {

    }
}

module.exports = new Messenger()

/**
 * Message types in Messenger
 * types = [ text, attachment, quick_replies] - meta_data Optional
 * text = only text, no links support, 2000 limit
 * attachment = audio, video, image, file, template
 * attachment.template = Button, etc
 * quick_replies = Quick user actions, upto 13, text, location, phone, etc
 */


// TODO - In Future store user jounrney definitions in DB

let road_map = {
    "1": {
        "type": "text.static",
        "properties": {
            "message": {
                "value": "Your first name, please?"
            }
        },
        "handler": {
            "type": "transaction",
            "function": "storeUserDetails",
            "data_mapping": {
                "messenger_id": "sender.id",
                "name": "message.text"
            }
        }
    },
    "2": {
        "type": "text.static",
        "properties": {
            "message": {
                "value": "Please send your DOB[YYYY-MM-DD]"
            }
        },
        "handler": {
            "type": "transaction",
            "function": "storeUserDOB",
            "data_mapping": {
                "dob": "message.text"
            }
        }
    },
    "3": {
        "type": "quick_replies.static",
        "properties": {
            "message": {
                "text": "Pick a color:",
                "quick_replies": [
                    {
                        "content_type": "text",
                        "title": "Yes",
                        "payload": "3.yes",
                    }, {
                        "content_type": "text",
                        "title": "No",
                        "payload": "3.no",
                    }
                ]
            }
        }
    },
    "3.yes": {
        "type": "text.dynamic",
        "handler": {
            "type": "analytics",
            "function": "calculateDayOfDOB",
            "data": {
                "message": {
                    "value": `There are {output.data} days left until your next birthday`
                }
            }
        }
    },
    "3.no": {
        "type": "text.static",
        "properties": {
            "message": {
                "value": "Goodbye 👋"
            }
        },
    }
}


let pace = [
    {
        "journey": 1,
        "name": "ask_name",
        "type": "text",
        "text": "Can you tell us your name?",
        "on_reply": {
            "type": "model",
            "model": "Users",
            "query": {
                "messenger_sender_id": {
                    type: "dynamic", // dynamic, static
                    value: "event.sender_id",
                    default: "Something" // incase of nothing computed
                },
            },
            "data_mapping": {
                "name": {
                    type: "dynamic",
                    value: "event.text"
                }
            }
        },
        "send_next": true
    },
    {
        "journey": 2,
        "name": "ask_dob",
        "type": "text",
        "text": "Please send us your Date of birth...",
        "on_reply": {
            "type": "model",
            "model": "Users",
            "query": {
                "messenger_sender_id": {
                    type: "dynamic",
                    value: "event.sender_id",
                }
            },
            "data_mapping": {
                "dob": {
                    type: "dynamic",
                    value: "event.text"
                }
            }
        },
        "send_next": true
    },
    {
        "journey": 3,
        "name": "days_question",
        "type": "quick_reply",
        "text": "Want to know how many days left for your next birthday..?",
        "values": ["Yes", "No"],
        "on_reply": {
            "type": "self",
            "3.yes.*": {
                "type": "handler",
                "handler": "sendUserDOBInDays"
            },
            "3.no.*": {
                "type": "text",
                "text": "Goodbye 👋 !!!"
            }

        },
        "is_last":true
    }
]


module.exports = pace
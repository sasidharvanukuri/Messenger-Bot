


const Conversation = require('../../models/conversations');
const Users = require('../../models/users');
const _ = require('lodash');

class Messages {

    getUserMessages(queryData) {
        return Conversation.find({
            "sender_id": queryData.user_id,
            "conversation_type": queryData.conversation_type || "user_message"
        }).then(res => {
            return res
        }).catch(e => {
            console.error(e)
            return {
                "status":false,
                "message": "Something went wrong"
            }
        })
    }

    getMessage(params) {
        return Conversation.findOne({
            message_id: params.id
        }).then(res => {
            return res || {}
        }).catch(e => {
            console.error(e)
            return {
                "status": false,
                "message": "Something went wrong"
            }
        })
    }

    usersMessageSummary() {
        let promises = []
        let user_data, messages
        promises.push(Users.find({}).then(res => user_data = res))
        promises.push(Conversation.find({ "conversation_type": "user_message" }).then(res => messages = res))
        return Promise.all(promises).then(()=> {
            let messagedGroupById = _.groupBy(messages, "sender_id")
            let response = []
            for(let each of user_data){
                let object = {}
                object["user"] = each.user_id
                object["name"] = each.name
                object["messages"] = _.map(messagedGroupById[each.messenger_sender_id], "text")
                response.push(object)
            }
            return response

        }).catch(e=>{
            console.error(e)
            return {
                "status": false,
                "message": "Something went wrong"
            }
        })




    }

}



module.exports = new Messages()
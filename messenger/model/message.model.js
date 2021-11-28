const mongoose = require('./mongoose')

const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        minlength: 2,
        maxlength: 280
    },
    author: {type: mongoose.Schema.Types.ObjectId , ref: 'user' , required: true},
    groupOwner: {
        type: mongoose.Types.ObjectId ,
        ref: 'group',
        required: true
    }
})

const MessageModel = mongoose.model('message', messageSchema);

module.exports = MessageModel
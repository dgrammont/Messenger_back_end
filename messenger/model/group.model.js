const mongoose = require('./mongoose')



const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: [true, 'Name is very important for me'],
        index: true,

    },
    auth: {type: mongoose.Schema.Types.ObjectId , ref: 'user' , required: true},
    users: [{type: mongoose.Schema.Types.ObjectId , ref: 'user'}],
    numberMessage:{
        type: Number,
        default:0

    } ,


});

const GroupModel = mongoose.model('group', groupSchema);

module.exports = GroupModel


const {use, route} = require("express/lib/router");
const express = require('express')
const {body, validationResult, param} = require("express-validator");
const GroupModel = require("../model/group.model");
const jsonwebtoken = require('jsonwebtoken');
const UserModel = require("../model/user.model");
const MessageModel = require("../model/message.model");
const router = express.Router()

/**
 * send a message
 */
router.post('/:group',
    body("content")
        .not().isEmpty()
        .withMessage('the message contains invalid characters')
        .trim().escape(),
    param('group')
        .notEmpty()
        .withMessage('Group names is required'),
    (req, res, next)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        next()
    },
    async (req , res) =>{
        console.log(req.params)

        let group = await  GroupModel.findOne({_id:req.params.group})
        if(!group){
            return res.status(404).send({message: 'group not found'})
        }

        try{
            let message = new MessageModel({
                content: req.body.content,
                author: req.user._id,
                groupOwner: req.params.group

            })

            group.numberMessage= group.numberMessage+1
            message = await  message.save()
            group = await group.save()
            return  res.send({group, message})

        }catch (e){
            res.status(400).send(e)
        }


    })


/**
 * display messages
 */
router.get('/displayMessage/:group' ,
    param('group')
        .notEmpty()
        .withMessage('Group names is required'),

    (req, res, next)=> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }
        next()
    },
    async (req , res) => {
        let limit =2
        let page = 2
        console.log(req.params)
        let group = await  GroupModel.findOne({_id:req.params.group})
        if(!group){
            return res.status(404).send({message: 'group not found'})
        }
        if(group.users.includes(req.params.id)){
            return  res.status(404).send({message: 'you are not in this group'})
        }
        if(req.query.page){
            page = req.query.page
        }
        let messages = await MessageModel.find({groupOwner: req.params.group})
            .limit(limit)
            .skip((page-1) * limit)


        res.send({
            messages,
            page,
            limit,
            total :group.numberMessage
        })

    }
)


module.exports = router
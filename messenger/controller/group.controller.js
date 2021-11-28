const {use, route} = require("express/lib/router");
const express = require('express')
const {body, validationResult, param} = require("express-validator");
const GroupModel = require("../model/group.model");
const jsonwebtoken = require('jsonwebtoken');
const UserModel = require("../model/user.model");
const MessageModel = require("../model/message.model");
const router = express.Router()


/**
 * create group
 */
router.post('/create', async  (req , res) =>{
    try {
        let group = new GroupModel(req.body)
        group.auth = req.user._id
        group.users.push(req.user._id)
        group = await group.save()
        res.status(201).send({group: group})
    }catch (e){
        res.status(400).send(e)
        console.error(e)
    }

})
/**
 * see our group
 */
router.get('/',async (req,res)=>{
    let limit =2
    let page = 1
    if(req.query.page){
        page = req.query.page
    }
   const groups = await GroupModel.find( { $or: [{ auth: req.user._id }, { users: req.user._id }]}
       ).limit(limit)
       .skip((page-1) * limit)

    res.send({
        page,
        limit,
        groups
    })
 })

/**
 * send invite
 */
router.post('/invite/:id/:group',
    param('id')
        .notEmpty()
        .withMessage('username is required')
        .isMongoId()
        .withMessage('is needs to be a mongodb'),
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

        let user = await UserModel.findOne({_id:req.params.id})
        if(!user._id.toString() === req.user._id ){
            return res.status(409).send({message: 'user not found'})
        }


        let group = await  GroupModel.findOne({_id:req.params.group})
        if(!group){
            return res.status(404).send({message: 'group not found'})
        }


        if(group.auth.toString() !== req.user._id ){
            return res.status(409).send({message: 'you are not the author'})
        }

        if(group.users.includes(req.params.id)){
            return res.status(409).send({message: 'user is already in group'})
        }


        group.users.push(user._id)
        group = await group.save()
        return  res.send({message: "User added", group,})


    })


 module.exports = router
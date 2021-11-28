const express = require('express')
const UserModel = require("../model/user.model");
const {use} = require("express/lib/router");
const {validationResult, param} = require("express-validator");
const router = express.Router()

/**
 *find user
 */
router.get('/', async (req, res) => {

    const users = await UserModel.find()
    res.send(users)
})

/**
 * create user
 */
router.post('/', async  (req , res) =>{
try {
    let user = new UserModel(req.body)
    user = await user.save()
    res.status(201).send({user: user})
}catch (e){
    res.status(400).send(e)
}
})
/**
 * find current user
 */
router.get('/me', async (req,res,)=>{
    if(!req.user){
        return res.status(401).send({message:'unauthorized'})
    }
    const user = await UserModel.findOne({_id: req.user._id})
    if(!user){
        return res.status(404).send({message: 'user not found'})
    }
    res.send({user:user})
})
/**
 * find by id
 */
router.get('/:id',
    param('id')
        .notEmpty()
        .withMessage('username is required')
        .isMongoId()
        .withMessage('is needs to be a mongodb'),
    (req, res, next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    next()
},
    async (req , res) =>{
    console.log(req.params)
    const user = await UserModel.findOne({_id:req.params.id})
    if(!user){
        res.status(404).send({message: 'user not found'})
    }
    res.send({user})
})

module.exports = router
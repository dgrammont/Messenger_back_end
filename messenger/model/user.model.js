const mongoose = require('./mongoose')
const bcrypt = require('bcrypt')
const {reject} = require("bcrypt/promises");
const buffer = require("buffer");
const SALT_WORK_FACTOR = 10
let salt = '$2b$10$uMMerxBWR8pPg8NFXLewXe'



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is very important for me'],
        index: true,
        validate: {
            validator: async (value, next) => {
                const users = await UserModel.find( {username: value});
                return  users.length === 0

             },
            message: 'user already exists!'
        }
    },
    password:{
        type: String,
        required: true,
    } ,
}, {timestamps: true});
userSchema.pre('save',function (next){
    const user = this

    if(!user.isModified('password')){
        return next();
    }
        bcrypt.hash(user.password, salt, function (err,hash){
            if (err) return next(err)

            user.password = hash;
            next()
        });

});

userSchema.methods.comparePassword = function (password) {
    const user = this;
    return new Promise( (resolve , reject )=>{


            bcrypt.hash(password, salt, function (err,hash){
                if (err) return reject(err);

                resolve(user.password === hash);
            });

    })
}
const UserModel = mongoose.model('user', userSchema);

module.exports = UserModel
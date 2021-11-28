const express = require('express')
const app = express()
const port = 3000
const UserController = require('./controller/user.controller')
const AuthController = require('./controller/auth.controller')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const GroupController =require('./controller/group.controller')
const MessageController =require('./controller/messsage.controller')
const jsonwebtoken = require("jsonwebtoken");
const {secret} = require('./config')

const i18next = require('i18next');
const Backend = require('i18next-fs-backend')
const middleware = require('i18next-http-middleware')

i18next.use(Backend).use(middleware.LanguageDetector)
    .init({
        fallbackLng: 'en',
        preload:['en','fr'],
        backend: {
            loadPath: './locales/{{lng}}/translation.json'
        }
    })

function checklog(req,res,next){
    console.log(req.language)
    if(!req.user){
        return  res.status(400).send(req.t('Not connected'))
    }
    next()
}

app.use(bodyParser.json())
app.use(cookieParser())
app.use((req,res,next)=>{
    console.log(req.cookies)
    if(!req.cookies.jwt){
        return next()
    }
    req.user = jsonwebtoken.verify(req.cookies.jwt,secret)

    next()
})

app.use(middleware.handle(i18next));
app.use('/api/users', UserController)
app.use('/api/auth',AuthController)
app.use('/api/group',checklog,GroupController)
app.use('/api/message',checklog,MessageController)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
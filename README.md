# Table of Contents
1. [Messenger_back_end](#Messenger_back_end)
2. [NPM](#NPM)
3. [Route description](#Route_description)
4. [Install](#Install)

# Messenger_back_end

This back-end application is a messenger with the basic function like :

| Methode  |  Function name  |
|:--------:|:---------------:|
|    GET   |     find by     |
|   POST   |     Create      |
|    GET   |    find by id   |
|    GET   |     find me     |
|    DEL   |      logout     |
|   POST   |      login      |
|   POST   |      create     |
|    GET   |    see group    |
|   POST   |      invite     |
|   POST   |   send message  |
|    GET   | display message |

# NPM

All NPM use for this projet :

- bcrypt
- body-parser
- cookie-parser
- express
- express-validator
- jsonwebtoken
- mongoose
- nodemon
- i18next
- i18next-fs-backend
- i18next-http-middleware

# Route_description

- find by: return the list of all user in database
- Create (in user): create a user with a username and password
- find by id : return the information of the user entered a parameter with id
- find me: return the information of current user
- logout: Ending the cookie duration
- login: Add a cookie to stay login
- Create (in group): Create a group with a name for group
- see group: return all the groups where we are present 
- invite (in group) : Add a user in groupe if you are the author 
- send message: Send a message in groupe you are present 
- display message: return all message of groupe with a limit of the number of message 

# Install 

To install the projet you just need to clone the projet and do **"npm start"** in a terminal 


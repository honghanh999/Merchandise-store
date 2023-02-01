const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const { renderJson } = require('../../util/app')
const { roleTypes } = require('../config/models')

class AppMiddleware {
    // Check authentication
    async authenticate (req, res, next ) {
        try {
            const token = req.headers.authorization.replace('Bearer ','')
            const  { id } = jwt.verify(token, process.env.PRIVATE_KEY)
            const user = await User.findById(id)
            req.user = user
            next()
        } catch(error) {
            res.status(401).json(renderJson({}, false, 401, 'Unauthorized'))
        }
    }
}
module.exports = AppMiddleware

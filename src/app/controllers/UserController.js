const User = require('../models/UserModel')
const { renderJson } = require('../../util/app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { limit, roleTypes } = require('../config/models')

class UserController {
    // Register
    async create(req, res) {
        try {
            const { username, email, password, role } = req.body
            const userExited = await User.findOne({ email })
            if (userExited) {
                throw new Error ('User exited')
            }
            const salt = bcrypt.genSaltSync(10)
            const passwordHashed = bcrypt.hashSync(password, salt)
            const data = { username, email, password: passwordHashed, role }
            const user = await User.create(data)
            const token = jwt.sign({
                id: user._id
            }, process.env.PRIVATE_KEY, { expiresIn: '1d' })
            res.json(renderJson({ user, token }))
        }
        catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Login
    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user || !bcrypt.compareSync(password, user.password)) {
                throw new Error ('Email or password is invalid')
            }
            const token = jwt.sign({
                id: user._id
            }, process.env.PRIVATE_KEY, { expiresIn: '1d' })
            res.json(renderJson({ user, token }))
        }
        catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Get personal information
    async getMe(req, res) {
        try {
            const { user } = req
            res.json(renderJson({ user }))
        }
        catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Admin get all client's information
    async getAllClients(req, res) {
        try {
            let { page, search } = req.query
            let dbQuery = {}
            if (search) {
                dbQuery.$or = [
                    {
                        username: {$regex: `(?i)${search}`}
                    },
                    {
                        email: {$regex: `(?i)${search}`}
                    }
                ]
            }
            const pageNumber = page ? parseInt(page) : 0
            const skip = pageNumber * limit
            const users = await User.find({ role: roleTypes.client, ...dbQuery }).limit(limit).skip(skip)
            const count = await User.count({ role: roleTypes.client, ...dbQuery })
            res.json(renderJson({ page: pageNumber, count, users }))
        } catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // User update information
    async update(req, res) {
        try {
            const { user } = req
            const { username, password, email } = req.body
            const salt = bcrypt.genSaltSync(10)
            const passwordHashed = bcrypt.hashSync(password, salt)
            const data = { username, password: passwordHashed, email }
            await User.updateOne({ _id: user._id }, {$set: data})
            const userUpdated = await User.findById(user.id)
            res.json(renderJson({ user: userUpdated }))
        } catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }
}

module.exports = UserController

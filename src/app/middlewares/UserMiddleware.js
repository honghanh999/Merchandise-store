const User = require("../models/UserModel");
const { renderJson } = require("../../util/app");
const Joi = require('joi')
const {roleTypes} = require("../config/models");

class UserMiddleware {
    async create (req, res, next) {
        const schema = Joi.object({
            username: Joi.string().required(),
            email: Joi.string().required().email(),
            password: Joi.string().required(),
            role: Joi.string()
        })
        try {
            await schema.validateAsync(req.body)
            next()
        }
        catch (err) {
            const error = err.details[0].message
            res.status(400).json(renderJson({}, false, 400, error))
        }
    }

    async login (req, res, next) {
        const schema = Joi.object({
            email: Joi.string().required().email(),
            password: Joi.string().required()
        })
        try {
            await schema.validateAsync(req.body)
            next()
        }
        catch (err) {
            const error = err.details[0].message
            res.status(400).json(renderJson({}, false, 400, error))
        }
    }

    async getAllClients (req, res, next) {
        const schema = Joi.object({
            page: Joi.number(),
            search: Joi.string()
        })
        try {
            await schema.validateAsync(req.query)
            next()
        }
        catch (err) {
            const error = err.details[0].message
            res.status(400).json(renderJson({}, false, 400, error))
        }
    }

    async update(req, res, next) {
        const schema = Joi.object({
            username: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().required(),
        })
        try {
            await schema.validateAsync(req.body)
            next()
        }
        catch (err) {
            const error = err.details[0].message
            res.status(400).json(renderJson({}, false, 400, error))
        }
    }

    async checkRoleAdmin (req, res, next) {
        try {
            const { user } = req
            if (user.role !== roleTypes.admin) {
                throw new Error ('Forbidden')
            }
            next()
        } catch {
            res.status(403).json(renderJson({}, false, 403, 'Forbidden'))
        }
    }

    async checkRoleClient (req, res, next) {
        try {
            const { user } = req
            if (!user.role === roleTypes.client) {
                throw new Error ('Forbidden')
            }
            next()
        } catch {
            res.status(403).json(renderJson({}, false, 403, 'Forbidden'))
        }
    }
}

module.exports = UserMiddleware

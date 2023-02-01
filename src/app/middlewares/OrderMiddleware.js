const Order = require("../models/OrderModel");
const { renderJson } = require("../../util/app");
const Joi = require('joi')
const {statusTypes} = require("../config/models");
const { ObjectID } = require("mongodb")

class OrderMiddleware {
    async create (req, res, next) {
        const schema = Joi.object({
            name: Joi.string(),
            address: Joi.string(),
            phoneNumber: Joi.string()
        })
        try {
            await schema.validateAsync(req.body)
            const { cartId } = req.query
            if (Array.isArray(cartId) === false) {
                throw new Error('Cart not found')
            }
            for (let i = 0; i < cartId.length; i++) {
                if (ObjectID.isValid(i) === false) {
                    throw new Error("Cart not found")
                }
            }
            next()
        }
        catch (err) {
            if (Array.isArray(err.details)) {
                const error = err.details[0].message
                res.status(400).json(renderJson({}, false, 400, error))
            }
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    async update(req, res, next) {
        const schema = Joi.object({
            status: Joi.string().valid(...statusTypes.all),
        })
        try {
            await schema.validateAsync(req.body)
            next()
        }
        catch (err) {
            if (Array.isArray(err.details)) {
                const error = err.details[0].message
                res.status(400).json(renderJson({}, false, 400, error))
            }
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }
}

module.exports = OrderMiddleware

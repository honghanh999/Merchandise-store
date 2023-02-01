const Cart = require("../models/CartModel");
const { renderJson } = require("../../util/app");
const Joi = require('joi')
const {roleTypes} = require("../config/models");
const { ObjectID } = require("mongodb")

class CartMiddleware {
    async create (req, res, next) {
        const schema = Joi.object({
            quantity: Joi.number(),
            productId: Joi.string()
        })
        try {
            await schema.validateAsync(req.body)
            // Check type ObjectId
            if (ObjectID.isValid(req.body.productId) === false) {
                throw new Error("Product not found")
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

    async update (req, res, next) {
        const schema = Joi.object({
            quantity: Joi.number(),
            productId: Joi.string()
        })
        try {
            await schema.validateAsync(req.body)
            if (ObjectID.isValid(req.body.productId) === false) {
                throw new Error("Product not found")
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
}

module.exports = CartMiddleware

const Product = require("../models/ProductModel");
const { renderJson } = require("../../util/app");
const Joi = require('joi')

class ProductMiddleware {
    async create (req, res, next) {
        const schema = Joi.object({
            name: Joi.string().required(),
            price: Joi.number().required(),
            description: Joi.string().required(),
            inventoryAmount: Joi.string().required(),
        })
        try {
            await schema.validateAsync(req.body)
            if(!req.files || !req.files.image) {
                throw new Error('Image is required')
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
            name: Joi.string(),
            price: Joi.number(),
            description: Joi.string(),
            inventoryAmount: Joi.number()
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
}

module.exports = ProductMiddleware

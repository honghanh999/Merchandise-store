const Product = require('../models/ProductModel')
const Cart = require('../models/CartModel')
const { renderJson, storeFile } = require('../../util/app')
const {limit, roleTypes} = require("../config/models");
const User = require("../models/UserModel");

class ProductController {
    // Admin create Product
    async create(req, res) {
        try {
            const { name, price, description, inventoryAmount } = req.body
            const { image } = req.files
            const { fileName, filePath } = storeFile(req, image)
            const handledImage = { fileName, filePath }
            const data = { name, price, description, image: handledImage, inventoryAmount }
            const product = await Product.create(data)
            res.json(renderJson({ product }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Get product
    async get(req, res) {
        try {
            const { id } = req.params
            const product = await Product.findById(id)
            res.json(renderJson({ product }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Admin update product
    async update(req, res) {
        try {
            const { id } = req.params
            const { name, price, description, inventoryAmount } = req.body
            const data = { name, price, description, inventoryAmount}
            if (req.files && req.files.image) {
                const { fileName, filePath } = storeFile(req, req.files.image)
                data.image = { fileName, filePath }
            }
            await Product.updateOne({ _id: id }, { $set: data})
            const product = await Product.findById(id)
            res.json(renderJson({ product }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Delete product
    async delete(req, res) {
        try {
            const { id } = req.params
            await Product.deleteOne({ _id: id })
            res.json(renderJson({}))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Get all product
    async index(req, res) {
        try {
            let { page, search } = req.query
            let dbQuery = {}
            if (search) {
                dbQuery.name = {$regex: `(?i)${search}`}
            }
            const pageNumber = page ? parseInt(page) : 0
            const skip = pageNumber * limit
            const products = await Product.find(dbQuery).limit(limit).skip(skip)
            const count = await Product.count(dbQuery)
            res.json(renderJson({ page: pageNumber, count, products }))
        } catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }
}

module.exports = ProductController

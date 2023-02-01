const Cart = require('../models/CartModel')
const Product = require('../models/ProductModel')
const { renderJson, storeFile } = require('../../util/app')
const { limit, roleTypes } = require("../config/models");
const User = require("../models/UserModel");

class CartController {
    // Add to cart
    async create(req, res) {
        try {
            let { quantity, productId } = req.body
            const { user } = req
            const product = await Product.findById(productId)
            const cart = await Cart.findOne({ productId, clientId: user._id })
            if (!product.inventoryAmount || product.inventoryAmount < parseInt(quantity)) {
                throw new Error ('Not enough quantity')
            }
            if (!productId) {
                throw new Error ("Not found")
            }
            let data = { productId, clientId: user._id }
            if (cart) {
                const totalQuantity = cart.quantity + parseInt(quantity)
                if (totalQuantity > product.inventoryAmount) {
                    throw new Error ('Not enough quantity')
                }
                data.quantity = totalQuantity
                data.totalPrice = totalQuantity * product.price
                await Cart.updateOne({ productId, clientId: user._id }, { $set: data })
            } else {
                if (parseInt(quantity) === 0) {
                    throw new Error ('Quantity need to greater than 0')
                }
                data.quantity = parseInt(quantity)
                data.totalPrice = parseInt(quantity) * product.price
                await Cart.create(data)
            }
            const cartFound = await Cart.findOne({ productId, clientId: user._id }).populate(['productId', 'clientId'])
            res.json(renderJson({ cart: cartFound }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Edit quantity of Product in Cart
    async update(req, res) {
        try {
            const { quantity, productId } = req.body
            const { user } = req
            if (!productId) {
                throw new Error ("Not found")
            }
            const product = await Product.findById(productId)
            const cart = await Cart.findOne({ clientId: user._id, productId })
            if (!cart) {
                throw new Error ('Not found')
            }
            if (parseInt(quantity) > product.inventoryAmount) {
                throw new Error ('Quantity not enough')
            }
            if (parseInt(quantity) === 0) {
                await Cart.deleteOne({ clientId: user._id, productId })
                res.json(renderJson({}))
            }
            const data = {
                quantity: parseInt(quantity),
                totalPrice: parseInt(quantity) * product.price
            }
            await Cart.updateOne({ _id: cart._id }, { $set: data })
            const newCart = await Cart.findById(cart._id).populate(['productId', 'clientId'])
            res.json(renderJson({ cart: newCart }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Get all product in Cart
    async index(req, res) {
        try {
            const { user } = req
            const cart = await Cart.find({ clientId: user._id }).populate(['productId', 'clientId'])
            const count = await Cart.count({ clientId: user._id })
            res.json(renderJson({ count, cart }))
        } catch(err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }
}

module.exports = CartController

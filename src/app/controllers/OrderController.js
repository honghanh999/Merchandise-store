const Order = require('../models/OrderModel')
const Product = require('../models/ProductModel')
const Cart = require('../models/CartModel')
const { renderJson, storeFile } = require('../../util/app')
const { limit, statusTypes } = require("../config/models");
const User = require("../models/UserModel");

class OrderController {
    // Create order
    async create(req, res) {
        try {
            const { user } = req
            const { cartId } = req.query
            const { name, address, phoneNumber } = req.body
            let totalPrice = 0
            for (let i = 0; i < cartId.length; i++) {
                const cart = await Cart.findById(cartId[i])
                if (!cart) {
                    throw new Error ("Cart not found")
                }
                totalPrice += cart.totalPrice
            }
            const data = { name, address, phoneNumber, cartId, status: statusTypes.pending, clientId: user._id, totalPrice }
            const order = await Order.create(data)

            // Delete product in cart and update inventory amount of product after create order
            for (let i = 0; i < cartId.length; i++) {
                const cart = await Cart.findById(cartId[i])
                const product = await Product.findById(cart.productId)
                const newInventoryAmount = product.inventoryAmount - cart.quantity
                await Cart.deleteOne({ _id: cartId[i] })
                await Product.updateOne({ _id: product._id }, { $set: { inventoryAmount: newInventoryAmount }})
            }
            res.json(renderJson({ order }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }

    // Admin update status for order
    async update(req, res) {
        try {
            const { id } = req.params
            const { status } = req.body
            await Order.updateOne({_id: id}, {$set: {status}})
            const orderUpdated = await Order.findById(id)
            res.json(renderJson({ order: orderUpdated }))
        } catch (err) {
            res.status(400).json(renderJson({}, false, 400, err.message))
        }
    }
}

module.exports = OrderController

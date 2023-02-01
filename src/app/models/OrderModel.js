const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { statusTypes } = require('../config/models')

const OrderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: statusTypes.all,
        default: statusTypes.pending,
        required: true
    },
    totalPrice: {
        type: Number,
        require: true
    },
    cartId: {
        type: [Schema.Types.ObjectId],
        ref: 'Cart',
        required: true
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

}, {
    timestamps: true
})

module.exports = mongoose.model('Order', OrderSchema)

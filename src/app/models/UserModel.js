const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { roleTypes } = require('../config/models')

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: roleTypes.all,
        default: roleTypes.client,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', UserSchema)

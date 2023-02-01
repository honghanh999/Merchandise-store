const express = require('express')
const router = express.Router()
const CartController = require('../app/controllers/CartController')
const cartController = new CartController
const CartMiddleware = require('../app/middlewares/CartMiddleware')
const cartMiddleware = new CartMiddleware
const AppMiddleware = require('../app/middlewares/AppMiddleware')
const appMiddleware = new AppMiddleware
const UserMiddleware = require('../app/middlewares/UserMiddleware')
const userMiddleware = new UserMiddleware

/**
 * @api {post} /carts Add to cart
 * @apiGroup Carts
 * @apiName Add to cart
 * @apiVersion 1.0.0
 *
 * @apiBody {Number} quantity
 * @apiBody {String} productId
 */
router.post('/', appMiddleware.authenticate, userMiddleware.checkRoleClient, cartMiddleware.create, cartController.create)

/**
 * @api {put} /carts Edit cart
 * @apiGroup Carts
 * @apiName Edit cart
 * @apiVersion 1.0.0
 *
 * @apiBody {Number} quantity
 * @apiBody {String} productId
 */
router.put('/', appMiddleware.authenticate, userMiddleware.checkRoleClient, cartMiddleware.update, cartController.update)

/**
 * @api {get} /carts Get all product in Cart
 * @apiGroup Carts
 * @apiName Get all product in Cart
 * @apiVersion 1.0.0
 */
router.get('/', appMiddleware.authenticate, userMiddleware.checkRoleClient, cartController.index)

module.exports = router

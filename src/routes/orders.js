const express = require('express')
const router = express.Router()
const OrderController = require('../app/controllers/OrderController')
const orderController = new OrderController
const OrderMiddleware = require('../app/middlewares/OrderMiddleware')
const orderMiddleware = new OrderMiddleware
const AppMiddleware = require('../app/middlewares/AppMiddleware')
const appMiddleware = new AppMiddleware
const UserMiddleware = require('../app/middlewares/UserMiddleware')
const userMiddleware = new UserMiddleware

/**
 * @api {post} /orders Create order
 * @apiGroup Orders
 * @apiName Create order
 * @apiVersion 1.0.0
 *
 * @apiQuery cartId
 *
 * @apiBody {String} name
 * @apiBody {Number} address
 * @apiBody {String} phoneNumber
 */
router.post('/', appMiddleware.authenticate, userMiddleware.checkRoleClient, orderMiddleware.create, orderController.create)

/**
 * @api {put} /orders Update order
 * @apiGroup Orders
 * @apiName Update order
 * @apiVersion 1.0.0
 *
 * @apiBody {String='pending', 'shipping', 'completed'} status
 */
router.put('/:id', appMiddleware.authenticate, userMiddleware.checkRoleAdmin, orderMiddleware.update, orderController.update)

module.exports = router

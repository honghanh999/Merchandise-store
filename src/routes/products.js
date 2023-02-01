const express = require('express')
const router = express.Router()
const ProductController = require('../app/controllers/ProductController')
const productController = new ProductController
const ProductMiddleware = require('../app/middlewares/ProductMiddleware')
const productMiddleware = new ProductMiddleware
const AppMiddleware = require('../app/middlewares/AppMiddleware')
const appMiddleware = new AppMiddleware
const UserMiddleware = require('../app/middlewares/UserMiddleware')
const userMiddleware = new UserMiddleware

/**
 * @api {post} /products Create product
 * @apiGroup Product
 * @apiName Create product
 * @apiVersion 1.0.0
 *
 * @apiBody {String} name
 * @apiBody {Number} price
 * @apiBody {String} description
 * @apiBody {File} image
 */
router.post('/', appMiddleware.authenticate, userMiddleware.checkRoleAdmin, productController.create)

/**
 * @api {get} /products/:id Get product
 * @apiGroup Product
 * @apiName Get product
 * @apiVersion 1.0.0
 * @apiParam {String} id Product id
 */
router.get('/:id', productController.get )

/**
 * @api {put} /products/:id Edit product
 * @apiGroup Product
 * @apiName Edit product
 * @apiVersion 1.0.0
 *
 @apiParam {String} id Product id
 *
 * @apiBody {String} [name]
 * @apiBody {Number} [price]
 * @apiBody {String} [description]
 * @apiBody {File} [image]
 */
router.put('/:id', appMiddleware.authenticate, userMiddleware.checkRoleAdmin, productMiddleware.update, productController.update)

/**
 * @api {delete} /products/:id Delete product
 * @apiGroup Product
 * @apiName Delete product
 * @apiVersion 1.0.0
 * @apiParam {String} id Product id
 */
router.delete('/:id', appMiddleware.authenticate, userMiddleware.checkRoleAdmin,productController.delete)

/**
 * @api {get} /products Get all products
 * @apiGroup Product
 * @apiName Get all products
 * @apiVersion 1.0.0
 *
 * @apiQuery [page=0]
 * @apiQuery [search]
 */
router.get('/',productController.index)

module.exports = router

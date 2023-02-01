const express = require('express')
const router = express.Router()
const UserController = require('../app/controllers/UserController')
const userController = new UserController
const UserMiddleware = require('../app/middlewares/UserMiddleware')
const userMiddleware = new UserMiddleware
const AppMiddleware = require('../app/middlewares/AppMiddleware')
const appMiddleware = new AppMiddleware

/**
 * @api {post} /users Create user
 * @apiGroup User
 * @apiName Create user
 * @apiVersion 1.0.0
 *
 * @apiBody {String} username
 * @apiBody {String} email
 * @apiBody {String} password
 * @apiBody {String="client","admin"} [role="client"]
 */
router.post('/', userMiddleware.create, userController.create)

/**
 * @api {post} /users/login Login user
 * @apiGroup User
 * @apiName Login user
 * @apiVersion 1.0.0
 *
 * @apiBody {String} email
 * @apiBody {String} password
 */
router.post('/login', userMiddleware.login, userController.login)

/**
 * @api {get} /users/me Get personal information
 * @apiGroup User
 * @apiName Get personal information
 * @apiVersion 1.0.0
 */
router.get('/me', appMiddleware.authenticate, userController.getMe)

/**
 * @api {get} /users/me Get information of all clients
 * @apiGroup User
 * @apiName Get information of all clients
 * @apiVersion 1.0.0
 *
 * @apiQuery [page=0]
 * @apiQuery [search]
 */
router.get('/', appMiddleware.authenticate, userMiddleware.checkRoleAdmin, userMiddleware.getAllClients, userController.getAllClients)

/**
 * @api {put} / Edit personal information
 * @apiGroup User
 * @apiName Edit personal information
 * @apiVersion 1.0.0
 *
 * @apiBody {String} [username]
 * @apiBody {String} [email]
 * @apiBody {String} [password]
 */
router.put('/', appMiddleware.authenticate, userController.update)

module.exports = router

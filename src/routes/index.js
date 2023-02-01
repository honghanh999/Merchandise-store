const usersRoute = require('./users')
const productsRoute = require('./products')
const cartsRoute = require('./carts')
const ordersRoute = require('./orders')

function route(app) {
    app.use('/users', usersRoute)
    app.use('/products', productsRoute)
    app.use('/carts', cartsRoute)
    app.use('/orders', ordersRoute)
}

module.exports = route


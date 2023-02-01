const limit = 5
const roleTypes = {
    all: ['admin', 'client'],
    admin: 'admin',
    client: 'client'
}

const statusTypes = {
    all: ['pending', 'shipping', 'completed'],
    pending: 'pending',
    shipping: 'shipping',
    completed: 'completed'
}

module.exports = { roleTypes, limit, statusTypes }

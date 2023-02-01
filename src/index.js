require('dotenv').config()
const express = require('express')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')
const app = express()
const port = 3333
const route = require('./routes')
const db = require('./app/config/db')
const path = require('path')

db.connect()
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use(fileUpload())
route(app)

app.use(express.static(process.cwd()))
app.get('/apidoc', (req, res) => {
    res.sendFile(path.join(`${process.cwd()}/apidoc/index.html`))
})

app.listen(port, () => {
    console.log(`App listen at http://localhost:${port}`)
})

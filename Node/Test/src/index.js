const express = require('express')
const helmet = require('helmet')

const piattiRouter = require('./routes/piatti')
const scortaRouter = require('./routes/scorta')

const hostname ="127.0.0.1"
const port = 4100
const app = express()

app.use(helmet())
app.use(express.json())

app.use('/fatture', express.static('dowload'))
app.use("/media", express.static('foto'))

app.use('/piatti', piattiRouter)
app.use('/scorta', scortaRouter)

// avvio il server
app.listen(port, () => {
    console.log(`Server avviato su http://${hostname}:${port}`)
})
const express = require('express')
const helmet = require('helmet')

const votiRouter = require('./routes/voti')
const presenzeRouter = require('./routes/presenze')

const port = 3100
const app = express()

app.use(helmet())
app.use(express.json())
app.use('/media', express.static('download'))

app.use('/voti', votiRouter)
app.use('/presenze', presenzeRouter)

// avvio il server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`)
})
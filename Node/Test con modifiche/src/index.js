const express = require('express')
const helmet = require('helmet')

const piattiRouter = require('./routes/piatti')
const scortaRouter = require('./routes/scorta')
const QRcode = require('qrcode')

const hostname ="127.0.0.1"
const port = 4100
const app = express()

app.use(helmet())
app.use(express.json())

app.use('/fatture', express.static('dowload'))
app.use("/media", express.static('foto'))

app.use('/piatti', piattiRouter)
app.use('/scorta', scortaRouter)


app.get('/piatti/:id', (req, res) => {

    const id = req.params

    res.send("ecco il piatto " +id)
})

app.get('/piatti/:id/qrcode', (req, res) => {

    const id = req.params

    const finalurl = `http://${hostname}:${port}/piatti/${id}`


    QRcode.toDataURL(finalurl, (dataurl) =>
    {
        res.send(`<img width="40%" src="${dataurl}" />`)
    })

    res.send("QR CODE ecco il piatto " +id)
})



// avvio il server
app.listen(port, () => {
    console.log(`Server avviato su http://${hostname}:${port}`)
})
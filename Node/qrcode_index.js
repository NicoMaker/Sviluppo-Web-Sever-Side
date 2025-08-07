const express = require('express')
const QRcode = require('qrcode')

const app = express()

app.get('/qrcode', (req, res) => {
    const {text} = req.query

    if(!text || text === '') {
        res.send('manca il parametro text')
    }

    QRcode.toDataURL(text,{
        width: 1000,
        margin: 1,
        color: {
            dark:"#010599FF",
            light:"#FFBF60FF"
          }
    },function (err, url) {
        res.send(`<img width="40%" src="${url}" />`)
    })
})

app.listen(3000, () => {
    console.log(`Listening on http://localhost:3000`)
})
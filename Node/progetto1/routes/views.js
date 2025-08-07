const express = require('express')

const router = express.Router()

//creo tutte le rotte (middleware) che mi servono e poi le esporto
router.get('/router', (req, res)=> {
    res.send('Sono il router')
})

module.exports = router

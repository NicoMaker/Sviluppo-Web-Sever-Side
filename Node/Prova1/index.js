require('dotenv').config()

const express = require('express')

const apiRouter = require('./routers/api') // carico il mio modulo api e lo assegno ad una costante apiRouter

const hostname = process.env.SERVER_HOSTNAME // assegno variabili dal file .env
const apiPort = process.env.SERVER_API_PORT // assegno variabili dal file .env

const api = express() // crea un'istanza di express chiamata api

api.use(express.json()) // mette il contenuto del corpo della richiesta dentro la chiave body di request (req.body)
api.use('/api', apiRouter) // passa il controllo di tutte le chiamate con prefisso /api ad apiRouter


api.use(express.json()) // mette il contenuto del corpo della richiesta dentro la chiave body di request (req.body)
api.use('/api', apiRouter) // passa il controllo di tutte le chiamate con prefisso /api ad apiRouter

// avvia l'istanza del server express sulla porta port e su indirizzo hostname
// avvia l'istanza del server express sulla porta apiPort e su indirizzo hostname
api.listen(apiPort, hostname, () => { 
    console.log(`Server API su http://${hostname}:${apiPort}`)
})
require('dotenv').config()
//Richiede il modulo dotenv ed esegue la funzine config()

const express = require('express')
const helmet = require('helmet')

const apiRouter = require('./routes/api')
const viewsRouter = require('./routes/views')
const pdfRouter = require('./routes/pdf')

//Process è un oggetto di node
//Permette di scrivere nel file di configurazione delle cose, tipo quelle che abbiamo nel file .env
//env sta per environment
const hostname = process.env.SERVER_HOSTNAME
const port = process.env.SERVER_PORT
const apiPort = process.env.SERVER_API_PORT

const redisHost = process.env.REDIS_SERVER_HOST;
const redisPort = process.env.REDIS_SERVER_PORT;

console.log(redisHost,redisPort)

//inizializziamo due server, uno api e uno views (sono degli oggetti, alla fine)
const api = express()
const views = express()

api.use(express.json())//Porta dei dati all'interno di body, affinché possano essere accessibili in un seondo momento.
api.use(helmet());

api.get("/", (req, res) => {
    res.send("Hello world!");
});

api.use('/api', apiRouter)//Qualunque cosa abbia la rotta /api verrà gestita dall'apiRouter
api.use('/pdf', pdfRouter)

views.use('/views', viewsRouter)//use voul dire che usa un middleware
views.use('/static', express.static('public'))//static è un contenuto statico(html, css, eccetera...), non una rotta
//Nome che public è la cartella che contiene un file html creato da te
views.listen(port, hostname, () => {
    console.log(`Server su http://${hostname}:${port}`)
})

api.listen(apiPort, hostname, () => {
    console.log(`Server API su http://${hostname}:${apiPort}`)
})


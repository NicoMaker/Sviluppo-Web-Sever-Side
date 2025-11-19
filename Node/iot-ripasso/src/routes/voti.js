const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    console.log('elenco voti')

    res.send([
        {
            nome: "tizio",
            cognome: "caio",
            voto: 1
        },
        {
            nome: "tizio 2",
            cognome: "caio 2",
            voto: 2
        }
    ])
})

router.get('/:id', (req, res) => {
    console.log(`singolo voto ${req.params.id}`)

    res.send({
        nome: "tizio",
        cognome: "caio",
        voto: 1
    })
})

router.post('/', (req, res) => {
    console.log('creazione voto', req.body)

    res.status(201).send('creazione voto')
})

router.put('/:id', (req, res) => {
    console.log(`rimpiazzo voto: ${req.params.id}`, req.body)

    res.send('rimpiazzo voto')
})

router.patch('/:id', (req, res) => {
    console.log(`modifico voto: ${req.params.id}`, req.body)

    res.send('modifico voto')
})


router.delete('/:id', (req, res) => {
    console.log(`elimina singolo voto ${req.params.id}`)

    res.send(`elimina singolo voto ${req.params.id}`)
})


module.exports = router
const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    console.log('elenco scorta')

    res.send([
        {
            nome: "tizio",
            quantita: 50,
            costo: 1
        },
        {
            nome: "tizio 2",
            quantita: 58,
            costo: 2
        }
    ])
})

router.get('/:id', (req, res) => {
    console.log(`singolo scorta ${req.params.id}`)

    res.send({
        nome: "tizio",
        quantita: 65,
        costo: 1
    })
})

router.post('/', (req, res) => {
    console.log('creazione scorta', req.body)

    res.status(201).send('creazione scorta')
})

router.put('/:id', (req, res) => {
    console.log(`rimpiazzo scorta: ${req.params.id}`, req.body)

    res.send('rimpiazzo scorta')
})

router.patch('/:id', (req, res) => {
    console.log(`modifico scorta: ${req.params.id}`, req.body)

    res.send('modifico scorta')
})


router.delete('/:id', (req, res) => {
    console.log(`elimina singolo scorta ${req.params.id}`)

    res.send(`elimina singolo scorta ${req.params.id}`)
})


module.exports = router
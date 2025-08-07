const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    console.log('elenco piatti')

    res.send([
        {
            primo: "prova",
            secondo: "csff",
            contorno: "dsffedf",
            dolce : "dsfe",
            prezzo : 12
        },
        {
            primo: "prova",
            secondo: "csff",
            contorno: "dsffedf",
            dolce : "dsfe",
            prezzo : 12
        }
    ])
})

router.get('/:id', (req, res) => {
    console.log(`singolo piatto ${req.params.id}`)

    res.send({
        primo: "prova",
        secondo: "csff",
        contorno: "dsffedf",
        dolce : "dsfe",
        prezzo : 12
    })
})

router.post('/', (req, res) => {
    console.log('creazione piatto', req.body)

    res.status(201).send('creazione piatto')
})

router.put('/:id', (req, res) => {
    console.log(`rimpiazzo piatto: ${req.params.id}`, req.body)

    res.send('rimpiazzo piatto')
})

router.patch('/:id', (req, res) => {
    console.log(`modifico piatto: ${req.params.id}`, req.body)

    res.send('modifico piatto')
})


router.delete('/:id', (req, res) => {
    console.log(`elimina singolo piatto ${req.params.id}`)

    res.send(`elimina singolo piatto ${req.params.id}`)
})


module.exports = router
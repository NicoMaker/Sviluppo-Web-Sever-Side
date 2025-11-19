const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
    console.log('elenco presenze')

    res.send('elenco presenze')
})


router.get('/:id', (req, res) => {
    console.log(`singolo presenza ${req.params.id}`)

    res.send(`singolo presenza ${req.params.id}`)
})

router.post('/', (req, res) => {
    console.log('creazione presenza')

    res.send('creazione presenza')
})

router.put('/:id', (req, res) => {
    console.log('rimpiazzo presenza')

    res.send('rimpiazzo presenza')
})

router.patch('/:id', (req, res) => {
    console.log('modifico presenza')

    res.send('modifico presenza')
})


router.delete('/:id', (req, res) => {
    console.log(`elimina singolo presenza ${req.params.id}`)

    res.send(`elimina singolo presenza ${req.params.id}`)
})


module.exports = router
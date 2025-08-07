const express = require('express')
const voti = require('./routes/voti')
const presenze = require("./routes/presenze")

const port = 3100
const app = express()

// qua metto le rotte
app.use("/voti", voti)

app.use("/presenze", presenze)

// avvio il server
app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`)
})
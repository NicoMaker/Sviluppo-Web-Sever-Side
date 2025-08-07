require("dotenv").config()

const express = require("express")
const apirouter = require("./routs/apirouter")

const api = express();

const hostname = process.env.hostname
const localport = process.env.localport

api.use(express.json())
api.use("/api", apirouter)

api.listen(localport,hostname , () => 
{
    console.log(`server al sito http://${hostname}:${localport}`)
})
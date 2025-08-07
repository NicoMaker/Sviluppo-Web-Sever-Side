require('dotenv').config()

const express = require('express')

const sqlite3 = require('sqlite3')
const path = require('path')

const db = new sqlite3.Database(
    path.join(__dirname,"../Database/database.db")
)

const routers = express.Router();

// routers.get("/routers", (req,res) =>
// {
//     res.sendFile(path.join(__dirname,'../HTML/html.html'))
// })

routers.get("/create", (req,res) =>
{
    db.serialize(() => {
        db.run("select ROWID,* from log2",
            if(err)
            {

            }
        )
    })
})

module.exports = routers
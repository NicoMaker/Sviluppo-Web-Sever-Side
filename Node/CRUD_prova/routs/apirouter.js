require("dotenv").config()
const express = require("express")
const sqlite3 = require("sqlite3")
const path = require("path")
const { serialize } = require("v8")
const { request } = require("https")
const { error, log } = require("console")

const db = new sqlite3.Database(
    path.join(__dirname, "../db/database.db")
)
const validkeys = [
    "Volt",
    "Current"
]

const router = express.Router()

router.get("/router", (req, res) => {
    res.send("sono il router")
})

router.post("/Create", (req, res) => {
    db.serialize(
        () => {
            db.run("INSERT INTO CRUD (Volt,Current) VALUES ($Volt , $Current)",
                {
                    $Volt: req.body.Volt,
                    $Current: req.body.Current
                },

                (error) => {
                    if (error) {
                        res.statusCode = 406
                        res.send("Dati non inseriti in modo corretto")
                    }
                    else
                        res.send("Dati inseriti in modo corretto")
                }

            )
        }
    )
})

router.put("/Update/:id", (req, res) => {
    db.serialize(
        () => {
            db.run("UPDATE CRUD SET Volt = $Volt , Current = $Current WHERE ROWID = $id",
                {
                    $id: req.params.id,
                    $Volt: req.body.Volt,
                    $Current: req.body.Current
                },

                (error) => {
                    if (error) {
                        res.statusCode = 406
                        res.send("Aggiornamneto non avvenuto")
                    }
                    else
                        res.send("Aggiornamneto avvenuto con successo")
                }

            )
        }
    )
})

router.get("/Read", (req,res) => 
{
    db.serialize(() => 
    {
        db.all("SELECT ROWID,* FROM CRUD", (err,rows)=>
        {
            if(err)
            {
                res.statusCode = 500
                res.send("Errore nel vedere i dati")
            }
            else
                res.send(rows)
        })
    })
})

router.get("/Read/:id", (req,res) => 
{
    db.serialize(() => 
    {
        db.get("SELECT ROWID,* FROM CRUD WHERE ROWID = $id",
        {
            $id: req.params.id
        },
        (err,row)=>
        {
            if(err)
            {
                res.statusCode = 500
                res.send("Errore nel vedere i dati")
            }
            else
                res.send(row)
        })
    })
})

router.patch("/Update/:id", (req, res) => {
    db.serialize(
        () => {
            const query = Object
            .keys(req.body)
            .filter(keys => validkeys.includes(keys))
            .map(key => `${key} = $${key}`)
            .join(', ')

            if(query === ''){
                res.end()
            }
            db.run(`UPDATE CRUD SET ${query} WHERE ROWID = $id`,
                {
                    $id: req.params.id,
                    $Volt: req.body.Volt,
                    $Current: req.body.Current
                },

                (error) => {
                    if (error) {
                        res.statusCode = 406
                        res.send("Aggiornamneto non avvenuto")
                    }
                    else
                        res.send("Aggiornamneto avvenuto con successo")
                }

            )
        }
    )
})

module.exports = router
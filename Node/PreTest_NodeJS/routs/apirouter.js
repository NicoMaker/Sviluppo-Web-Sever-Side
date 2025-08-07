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
    "Voti",
    "Presenze"
]

const router = express.Router()

router.get("/router", (req, res) => {
    res.send("sono il router")
})

router.post("/Create", (req, res) => {
    db.serialize(
        () => {
            db.run("INSERT INTO Studenti (Voti,Presenze) VALUES ($Voti , $Presenze)",
                {
                    $Voti: req.body.Voti,
                    $Presenze: req.body.Presenze
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
            db.run("UPDATE SET Studenti Voti = $Voti , Presenze = $Prsenze  WHERE ROWID = $id",
                {
                    $id: req.params.id,
                    $Voti: req.body.Voti,
                    $Presenze: req.body.Presenze
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

router.get("/Read", (req, res) => {
    db.serialize(() => {
        db.all("SELECT ROWID,* FROM Studenti", (err, rows) => {
            if (err) {
                res.statusCode = 500
                res.send("Errore nel vedere i dati")
            }
            else
                res.send(rows)
        })
    })
})

router.get("/Read/:id", (req, res) => {
    db.serialize(() => {
        db.get("SELECT ROWID,* FROM Studenti WHERE ROWID = $id",
            {
                $id: req.params.id
            },
            (err, row) => {
                if (err) {
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

            if (query === '') {
                res.end()
            }
            db.run(`UPDATE Studenti SET ${query} WHERE ROWID = $id`,
                {
                    $id: req.params.id,
                    $Voti: req.body.Voti,
                    $Presenze: req.body.Presenze
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

router.delete("/Delete/:id", (req, res) => {
    db.serialize(() => {
        db.get("DELETE FROM Studenti WHERE ROWID = $id",
            {
                $id: req.params.id
            },
            (err, row) => {
                if (err) {
                    res.statusCode = 500
                    res.send("Errore nel cancellare i dati")
                }
                else
                    res.send("Eliminazione avvenuta con successo")
            })
    })
})

router.delete("/DeleteAll", (req, res) => {
    db.serialize(() => {
        db.all("DELETE FROM Studenti",
            {
                $id: req.params.id
            },
            (err, row) => {
                if (err) {
                    res.statusCode = 500
                    res.send("Errore nel cancellare i dati")
                }
                else
                    res.send("Eliminazione completa avvenuta con successo")
            })
    })
})

router.get("/Condividi", (req, res) => {
    db.serialize(() => {
        db.all("SELECT ROWID,Presenze FROM Studenti",
            {
                $id: req.params.id,
                $Presenze: req.body.Presenze
            },
            (err, row) => {
                if (err) {
                    res.statusCode = 500
                    res.send("Errore nel vedere i dati")
                }
                else
                    res.send(row)
            })
    })
})

router.get("/OrdinamentoMaggiore", (req, res) => {
    db.serialize(() => {
        db.all("SELECT ROWID,* FROM Studenti ORDER BY Voti DESC",
            {
                $id: req.params.id,
                $Presenze: req.body.Presenze,
                $Voti: req.body.Voti
            },
            (err, row) => {
                if (err) {
                    res.statusCode = 500
                    res.send("Errore nel vedere i dati")
                }
                else
                    res.send(row)
            })
    })
})

router.get('/media/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, 'download', filename);
    res.download(filePath, (err) => {
      if (err) {
        console.log('errre scaricamento file:', err);
        res.status(404).send('Fie non trovato');
      }
      else
        res.send("file scaricato")
    });
  });

module.exports = router
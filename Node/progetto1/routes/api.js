require('dotenv').config()//Richiede il modulo 'dotenv' ed esegue la configurazione
//Non serve metterlo in una costante, ma eseguo subito il metodo config()

const { Telegraf } = require('telegraf'); //Usa solo il metodo o proprietà chiamato 'telegraf'
const { message } = require('telegraf/filters');
const express = require('express')
const sqlite3 = require('sqlite3').verbose()//verbose ppermette di avere dei feedback capibili da noi comuni mortali
const path = require('path')

const redis = require('redis')

const redisHost = process.env.REDIS_SERVER_HOST;
const redisPort = process.env.REDIS_SERVER_PORT;

console.log(redisHost, redisPort);

const redisClient = redis.createClient({
    url: `redis://${redisHost}:${redisPort}`
})

redisClient.on('error', err => console.log('Redis Client Error', err)); // visualizza errore se c'è non fa partire






const validKeys = [
    "rpm",
    "volt",
    "current",
    "temp",
    "sender",
    "time"
]

const db = new sqlite3.Database(
    path.join(
        __dirname,
        '../db',
        'database.db'
    )
)

const router = express.Router()

router.get('/log',async (req, res) => {
    // console.log('chatId', chatId)

    await redisClient.connect();

    const keyExists = await redisClient.exists('key13')

    if(keyExists)
    {
        const cache = await redisClient.get('key13')
        console.log("la chiave esiste ")
        await redisClient.disconnect();
        return res.send(cache)
    }

    console.log("calcolo nuovo valore")

    db.serialize(() => {
        db.all('SELECT ROWID,* FROM log', async(err, rows) => {
            if (err) {
                console.error(err)
                res.statusCode = 500;
                res.send('Errore elenco dati')
            } else {
                await redisClient.set('key13',JSON.stringify(rows)) // converto in stringa dal db da mettere al json
                await redisClient.disconnect();
                res.send(rows)
            }
        })
    })
})

router.get('/log/:id', (req, res) => {
    db.serialize(() => {
        db.get(
            'SELECT ROWID,* FROM log WHERE ROWID = $id',
            {
                $id: req.params.id
            },
            (err, row) => {
                if (err) {
                    console.error(err)
                    res.statusCode = 400;
                    res.send('Errore database')
                } else {
                    res.send(row)
                }
            })
    })
})

router.post('/log', (req, res) => {
    db.serialize(() => {
        db.run('INSERT INTO log (rpm, volt, current, temp, sender, time, timeInsert) VALUES ($rpm, $volt, $current, $temp, $sender, $time, STRFTIME(\'%s\', \'now\') )',
            {
                $rpm: req.body.rpm,
                $volt: req.body.volt,
                $current: req.body.current,
                $temp: req.body.temp,
                $sender: req.body.sender,
                $time: req.body.time,
            },
            (err) => {
                if (err) {
                    console.log('err', err)
                    res.statusCode = 406;
                    res.send('Dati non validi, verifica')
                } else {
                    if (req.body.$current < 2000) {
                        bot.telegram.sendMessage(chatId, "Attenzione livello allarme", {
                            reply_markup: {
                                inline_keyboard: [
                                    { text: "Riavvia", callback_data: "btn-1" },
                                    { text: "Annulla", callback_data: "btn-2" }
                                ]
                            }
                        })
                    }
                    res.send('Nuovo log creato')
                }
            })
    })
})

router.put('/log/:id', (req, res) => {
    db.serialize(() => {
        db.run('UPDATE log SET rpm = $rpm, volt = $volt, current = $current, temp = $temp, sender = $sender, time = $time, timeInsert = STRFTIME(\'%s\', \'now\') WHERE rowid = $id',
            {
                $rpm: req.body.rpm,
                $volt: req.body.volt,
                $current: req.body.current,
                $temp: req.body.temp,
                $sender: req.body.sender,
                $time: req.body.time,
                $id: req.params.id
            },
            (err) => {
                if (err) {
                    console.log('err', err)
                    res.statusCode = 406;
                    res.send('Dati non validi, verifica')
                } else {
                    res.send('log modificato')
                }
            })
    })
})

router.patch('/log/:id', (req, res) => {
    db.serialize(() => {
        const query = Object // {"rpm": 2400, "volt": 12, "pinco": 123}
            .keys(req.body)  // ["rpm", "volt", "pinco"]
            .filter(key => validKeys.includes(key)) // ["rpm", "volt"]
            .map(key => `${key} = $${key}`) // ["rpm = $rpm", "volt = $volt"]
            .join(', ') // "rpm = $rpm, volt = $volt"

        if (query === '') {
            res.statusCode = 406;
            res.end();
        }

        db.run(`UPDATE log SET ${query}, timeInsert = STRFTIME(\'%s\', \'now\') WHERE rowid = $id`,
            //Passo i parametri
            {
                $rpm: req.body.rpm,
                $volt: req.body.volt,
                $current: req.body.current,
                $temp: req.body.temp,
                $sender: req.body.sender,
                $time: req.body.time,
                $id: req.params.id
            },
            (err) => {
                if (err) {
                    console.log('err', err)
                    res.statusCode = 406;
                    res.send('Dati non validi, verifica')
                } else {
                    res.send('log modificato')
                }
            })
    })
})

router.delete('/log/:id', (req, res) => {
    db.serialize(() => {
        db.run(
            'DELETE FROM log WHERE ROWID = $id',
            {
                $id: req.params.id
            },
            (err) => {
                if (err) {
                    console.error(err)
                    res.statusCode = 400;
                    res.send('Errore database')
                } else {
                    res.send('Dato eliminato')
                }
            })
    })
})

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = router
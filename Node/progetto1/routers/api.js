require('dotenv').config()

const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

let chatId

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => {
    chatId = ctx.chat.id
    console.log(chatId)
    ctx.reply('Welcome to monitoring system!!!')
});
bot.launch();

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

router.get('/log', (req, res) => {
    db.serialize(() => {
        db.all('SELECT ROWID,* FROM log', (err, rows) => {
            if (err) {
                console.error(err)
                res.statusCode = 500;
                res.send('Errore elenco dati')
            } else {
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
                    if (req.body.rpm < 2000) {
                        bot.telegram.sendMessage(chatId, 'Attenzione livello di allarme')

                    }
                    res.send('Nuovo log creato')
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
                    if (req.body.rpm < 2000) {
                        bot.telegram.sendMessage(
                            chatId,
                            'Attenzione livello di allarme!!!',
                            { 
                                reply_markup: {
                                    inline_keyboard: [
                                        [
                                            { text: "Riavvia", callback_data: "btn-1" },
                                            { text: "Annulla", callback_data: "btn-2" }
                                        ]
                                    ]
                                }
                            }
                        )
                    }
                    res.send('Nuovo log creato')
                }
            })
    })
})

router.patch('/log/:id', (req, res) => {
    db.serialize(() => {
        const query = Object
            .keys(req.body)
            .filter(key => validKeys.includes(key))
            .map(key => `${key} = $${key}`)
            .join(', ')

        if (query === '') {
            res.statusCode = 406;
            res.end();
        }

        db.run(`UPDATE log SET ${query}, timeInsert = STRFTIME(\'%s\', \'now\') WHERE rowid = $id`,
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
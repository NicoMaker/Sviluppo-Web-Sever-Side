const express = require('express')
const puppeteer = require('puppeteer')

const router = express.Router()
const path = require('path')
const fs = require('fs')


// router.get('/', (req, res)=>{
//     res.render('../public/index.html')
// })

router.get('/download', (req, res) => {
    const file = path.join(__dirname, '../screenshot.pdf')

    const stream = fs.createReadStream(file)

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=schermata.pdf')


    stream.pipe(res)

})

router.get('/inline', (req, res) => { //La inline permette di far visualizzare il contenuto nella pagina del browser senza bisogno di scaricarlo
    console.log("inline eseguito!")
    const file = path.join(__dirname, '../screenshot.pdf')
    const stream = fs.createReadStream(file)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline; filename=schermata.pdf')

    stream.pipe(res)
})

// router.get('/download-mp3', (req, res) => {
//     console.log('accesso a download')

//     const file = path.join(__dirname, '../audio.mp3')
//     const stream = fs.createReadStream(file)

//     res.setHeader('Content-Type', 'audio/mpeg')
//     res.setHeader('Content-Disposition', 'attachment; filename=audio.mp3')

//     stream.pipe(res)
// })

// router.get('/inline-mp3', (req, res) => {
//     console.log('accesso inline')

//     const file = path.join(__dirname, '../audio.mp3')
//     const stream = fs.createReadStream(file)

//     res.setHeader('Content-Type', 'audio/mpeg')
//     res.setHeader('Content-Disposition', 'inline; filename=audio.mp3')

//     stream.pipe(res)
// })


router.post('/create', async (req, res) => {
    console.log("create eseguito!")

    const browser = await puppeteer.launch({
        headless: false
    });

    const page = await browser.newPage()

    await page.goto('https://www.google.com', {
        waitUntil: 'networkidle2'
    })

    await page.pdf({
        format: 'A4',
        path: 'screenshot.pdf'
    })

    await browser.close()

    res.send("Create creato")
})



module.exports = router;
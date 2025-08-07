const express = require('express')
const puppeteer = require('puppeteer')

const router = express.Router()

router.get('/downnload', (req, res) => {
    console.log('accesso a download')
    res.send("Dowload")
})

router.get('/inline', (req, res) => {
    console.log('accesso inline')
    res.send("InLine")
})

router.post('/create', async (req, res) => {
    console.log('creazione pdf')

    const browser = await puppeteer.launch({
        headless: true
    })

    const page = await browser.newPage()
    await page.goto(
        'https://www.google.com', 
        {
            waitUntil: 'networkidle2'
        }
    )
    
    await page.pdf({
        format: 'A4',
        path: 'screenshot.pdf'
    })
    
    await browser.close()
    
    res.send("Creazione")
})

module.exports = router;
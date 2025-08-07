const express = require ('express')

const router = express.Router()

router.get('/', (req,res)=>{
    res.send('sono i voti che dovrebbero darci nella pagina comune')
}
)
module.exports = router
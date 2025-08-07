const express = require ('express')

const router = express.Router()

router.get('/', (req,res)=>{
    res.send('sono le presenze i che dovrebbero darci nella pagina comune')
}
)

module.exports = router
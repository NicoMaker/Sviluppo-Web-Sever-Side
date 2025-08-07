const express = require('express')

const router = express.Router();

router.get('/router',function(req,res){
    res.send("Sono il router")
})


module.exports = router
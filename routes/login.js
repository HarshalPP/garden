const express =require('express')
const router = express.Router()
const logindata=require('../controller/login')

router.post('/login', logindata.login)
module.exports=router;

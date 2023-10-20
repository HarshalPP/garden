const express =require('express')
const router = express.Router()
const Registerdata=require('../controller/Register')

router.post('/create', Registerdata.Register)
module.exports=router;

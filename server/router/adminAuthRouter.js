import express from 'express'
import {adminLogin} from '../controller/adminLoginController.js'
const route = express.Router();


//admin login
route.post('/login',adminLogin)


export default route
import  {Router } from 'express'
import {url} from '../controllers/convert.js'
const router1=Router()

router1.post('/url',url)

export default router1;
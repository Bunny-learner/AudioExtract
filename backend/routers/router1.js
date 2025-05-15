import  {Router } from 'express'
import {url,diffurl} from '../controllers/convert.js'
const router1=Router()

router1.post('/url',url)
router1.get('/diffurl',diffurl)
export default router1;
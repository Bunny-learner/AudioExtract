import  {Router } from 'express'
import {url,diffurl, videosend} from '../controllers/convert.js'
const router1=Router()

router1.post('/url',url)
router1.get('/audio',diffurl)
router1.get('/video',videosend)
export default router1;
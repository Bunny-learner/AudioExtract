import express from 'express'
import cors from 'cors'
import path from 'path'
const apk=express()


apk.use(cors({ origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']}))
apk.use(express.static('public'))//assests such as files that can be accessed by anyone
apk.use('/downloads',express.static(path.resolve('downloads')))
apk.use(express.urlencoded({ extended: true }))
apk.use(express.json())//req.body that holds data sent in the body of a POST, PUT, PATCH, or DELETE request. This data might include form submissions, JSON payloads, or other formats and it converts json to jsobj


import router1 from './routers/router1.js'

apk.use('/',router1)

export default apk

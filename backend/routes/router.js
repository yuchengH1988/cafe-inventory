const express = require('express')
const router = new express.Router()

const apis = require('./apis')
const apiAdmins = require('./apiAdmins')

router.use('/api', apis)
router.use('/api/admin', apiAdmins)

module.exports = router

const express = require("express")
const {sendNotification} = require("../controllers/notification.controller")
const checkAuth = require('../middlewares/chceckAuth.middleware')

const router = express.Router()

router.post('/send-notification', checkAuth, sendNotification)

module.exports = router
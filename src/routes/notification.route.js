const express = require("express")
const {sendNotification, saveNotification, getUserAllNotification} = require("../controllers/notification.controller")
const checkAuth = require('../middlewares/chceckAuth.middleware')

const router = express.Router()

router.post('/send-notification', checkAuth, sendNotification)
router.post('/save-notification', checkAuth, saveNotification)
router.get('/user-notifications/:user_id', getUserAllNotification)

module.exports = router
const {pushNotification} = require('../services/notification.service')

async function sendNotification(req, res){

    const {to, title, body} = req.body

    if(!to || !title || !body){
        return res.status(400).json({
            message: "Missing required fields",
            status: false
        })
    }

    try{
        
        const result = await pushNotification(to, title, body)
        res.status(200).json(result)

    }catch(err){
        console.error("Push error:", err.message)
        res.status(500).json({
            message: "Failed to send notification",
            status: false
        })
    }

}

module.exports = {
    sendNotification
}
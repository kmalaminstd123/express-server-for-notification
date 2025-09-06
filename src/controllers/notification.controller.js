const {pushNotification, saveNotificationToDatabase, getUserAllNotificationsFromDatabase} = require('../services/notification.service')

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

async function saveNotification(req, res){
    const { title, body, user_id } = req.body
    
    if(!title || !body || !user_id){
        return res.status(400).json({
            message: "Missing required fields",
            status: false
        })
    }

    try{
        const result = await saveNotificationToDatabase(title, body, user_id)
        res.status(200).json(result)
    }catch(err){
        console.log('error on saving notification', err);
        res.status(500).json({
            message: "Failed to save notification",
            status: false
        })
    }

}

async function getUserAllNotification(req, res){
    
    
    const user_id = parseInt(req.params.user_id)
    
    // res.status(200).json({
    //     user_id,
    //     message: "Hello"
    // })

    if(!user_id){
        return res.status(404).json({
            message: 'Nothing found',
            status: false
        });
    }
    
    try{
        const result = await getUserAllNotificationsFromDatabase(user_id)
        res.status(200).json(result)
    }catch(err){
        console.error('Error fetching notifications:', err);  // 👈 full error
        res.status(500).json({
            message: "Failed to get notification",
            status: false,
            error: err   // 👈 include for debugging
        })
    }
}

module.exports = {
    sendNotification,
    saveNotification,
    getUserAllNotification
}
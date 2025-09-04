const {expoPushNotificationUrl} = require("../config/app.config")

async function pushNotification(to, title, body){
    const message = {
        to, 
        title,
        body
    }

    try{
        const res = await fetch(expoPushNotificationUrl, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Accept-encoding": "gzip, deflate",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message)
        })
        const result = await res.json()
        return result
    }catch(err){
        throw new Error("Expo push request failed: " + err.message)
    }
}

module.exports = {
    pushNotification
}
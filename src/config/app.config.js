require("dotenv").config()

module.exports = {
    port: process.env.PORT || 5555,
    expoPushNotificationUrl: "https://exp.host/--/api/v2/push/send" 
}
const {expoPushNotificationUrl} = require("../config/app.config")
const {db} = require("../config/database.config")


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

function saveNotificationToDatabase(title, body, user_id){
    
    return new Promise((resolve, reject) => {
        
        const insertDataToDatabase = `INSERT INTO notification (title, body, user_id) VALUES (?, ?, ?)`
        
        db.query(insertDataToDatabase, [title, body, user_id], (err, result) => {
            if(err){
                console.error("DB Insert Error:", err);
                return reject({
                    message: "Failed to insert data on database",
                    status: false
                })
            }
            return resolve({
                message: "Data inserted on database",
                status: true
            })
               
        })
        
    })
    
    
     
}



function getUserAllNotificationsFromDatabase(user_id) {
    
    // return {
    //     name: "alamin",
    //     user_id
    // }
    
    return new Promise((resolve, reject) => {
        const getNotificationQuery = 'SELECT * FROM notification WHERE user_id = ?';
        db.query(getNotificationQuery, [user_id], (err, result) => {
            if (err) {
                console.error("DB query error:", err); // log full MySQL error
                return reject({
                    message: "Failed to get data from database",
                    status: false,
                    error: {
                        code: err.code,
                        errno: err.errno,
                        sqlMessage: err.sqlMessage,
                        sqlState: err.sqlState
                    }
                });
            }
            // Resolve with actual data
            return resolve({
                message: result,
                status: true
            });
        });
    });
    
}



module.exports = {
    pushNotification,
    saveNotificationToDatabase,
    getUserAllNotificationsFromDatabase
}
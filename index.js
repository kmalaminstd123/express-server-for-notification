const express = require("express")
const bodyParser = require("body-parser")



const app = express()

app.use(bodyParser.json())
// app port
const port = process.env.port || 5555

// notification route
app.post('/send-notification', async (req, res) => {

    const {to, title, body} = req.body

    const message = {
        to,
        title,
        body,
    }

    console.log(message);
    

    try{

        const response = await fetch(`https://exp.host/--/api/v2/push/send`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': "gzip, deflate",
                'Content-Type' : 'Application/json'
            },
            body: JSON.stringify(message)
        })

        const result = await response.json()
        console.log(result);
        

        res.json(result)

    }catch(err){
        console.log("Push error:", err);
        res.status(500).json({ error: "Failed to send notification" });
    }

})


/// listen server
app.listen(port, () => {
    console.log(`Your app running on the port ${port}`);  
})
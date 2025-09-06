const express = require("express");
const cors = require("cors")
const bodyParser = require("body-parser");
const { port } = require("./config/app.config");
const notificationRoutes = require("./routes/notification.route");
const { db } = require("./config/database.config")

const app = express();

// middleware
app.use(cors())
app.use(bodyParser.json());

// database connect
// database connection
db.connect(err => {
    if(err){
        console.log('database connection error', err);
        throw err
    }else{
        console.log('Database connected');
    }
})


app.use(express.urlencoded({ extended: true }));
// routes
app.use("/api", notificationRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

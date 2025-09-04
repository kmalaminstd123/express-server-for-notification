const express = require("express");
const bodyParser = require("body-parser");
const { port } = require("./config/app.config");
const notificationRoutes = require("./routes/notification.route");

const app = express();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
// routes
app.use("/api", notificationRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

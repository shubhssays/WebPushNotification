require("dotenv").config();
const express = require("express");
const webPush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;
const privateVapidKey = process.env.PRIVATE_VAPID_KEY;

webPush.setVapidDetails(
  "mailto:abc@gmail.com",
  publicVapidKey,
  privateVapidKey
);

app.get("/", (req, res) => {
  res.render("index.ejs", {publicVapidKey: publicVapidKey});
});

app.post("/send-notification", (req, res) => {
  const subscription = req.body;
  console.log("req.body --> ", subscription);
  res.status(201).json({});
  const payload = JSON.stringify({
    title: "Push Notification Using web-push & Service Workers",
    body:"This is notification demo..."
  });
  webPush
    .sendNotification(subscription, payload)
    .catch((error) => console.error(error));
});

app.listen(process.env.PORT, process.env.HOST, function () {
  console.log(
    "Node app is listening at http://%s:%s",
    process.env.HOST,
    process.env.PORT
  );
});

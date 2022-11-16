const express = require("express");
const app = express();
const subscriberModel = require("./models/subscribers");

app.use(express.json());

//1.GET http://localhost:3000/ → The client will see the “Hello User!” message which is used to verify that application is working properly.
app.get("/", (req, res) => {
  res.json("Hello User!");
});

//2.GET http://localhost:3000/subscribers → When the user hit this,endpoint /subscribers, the client will get an array of all subscribers in JSON format from the database where the data is stored in local MongoDB database.
app.get("/subscribers", async (req, res) => {
  const subscribers = await subscriberModel.find().select("-__v");
  res.json(subscribers);
});

//3.GET http://localhost:3000/subscribers/names →When the user hit this, endpoint /subscribers/names the client will to get an array of all subscribers in JSON format with only name and subscribed Channel fields from the database, where the data is stored in local MongoDB database.
app.get("/subscribers/names", async (req, res) => {
  const subscribers = await subscriberModel
    .find()
    .select("-_id -subscribedDate -__v");
  res.json(subscribers);
});

//4.GET http://localhost:3000/subscribers/:id → When the user hit this, endpoint /subscribers/:id in ID, the user needs to enter the USER’S ID which is stored in the database to get a particular user’s details like name, subscribed Channel and subscribed Date from the database, where the data is stored in local MongoDB database.
app.get("/subscribers/:id", async (req, res) => {
  const id = req.params.id;

  await subscriberModel
    .findById(id)
    .select("-__v")
    .then((data) => {
      if (!data) {
        // When the subscriber is not found for the given id.
        error = Error(`Subscriber doesn't exist with the given _id: ${id}.`);
        res.status(400).json({ message: error.message });
      } else {
        res.json(data);
      }
    })
    .catch((error) => {
      // When the id is not entered in the correct format.
      res.status(400).json({
        message: `Subscriber doesn't exist with the given _id: ${id}.`,
      });
    });
});

//5.GET http://localhost:3000/something → when the user hit the unwanted route which is not mentioned above (which is used to handle all other requests), they will get an error message like Route not found in JSON format with an 404 error status code.
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;

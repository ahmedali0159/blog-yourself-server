const express = require("express");
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("blogYourself!");
});


const { MongoClient } = require('mongodb');
const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g3qco.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
    console.log('connection err',err);
  const postCollection = client.db("blog-yourself").collection("post");
  console.log('database connected successfully')

  app.get('/events', (req, res)=> {
      postCollection.find()
      .toArray((err, items) => {
          res.send(items);
          console.log('from database', items);
      })
  })

  app.get('/event/:id', (req,res) => {
    console.log(req.params.id);
    postCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      res.send(items);
      console.log(items);
    })
  })

  app.post("/addEvent", (req, res) => {
    const newEvent = req.body;
    console.log("adding new event", newEvent);
    postCollection.insertOne(newEvent).then((result) => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0);
    });
  });


});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

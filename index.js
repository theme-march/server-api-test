const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hr7oi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const productadd = client.db("racezonebicycle").collection("productall");
    const useradd = client.db("racezonebicycle").collection("useradd");
    const userreviews = client.db("racezonebicycle").collection("reviews");
    const oderlist = client.db("racezonebicycle").collection("oderlist");

    // user creacte
    app.post("/user/add", async (req, res) => {
      const user = req.body;
      const result = await useradd.insertOne(user);
      res.json(result);
    });

    app.put("/user/add", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const options = { upsert: true };
      const insterDoc = { $set: user };
      const result = await useradd.updateOne(query, insterDoc, options);
      res.json(result);
    });

    // admin and user onlay data
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await useradd.findOne(query);
      let adminResult = false;
      if (result?.role === "admin") {
        adminResult = true;
      }
      res.json({ admin: adminResult });
    });

    app.put("/make/admin", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const role = { role: "admin" };
      const insertData = { $set: role };
      const result = await useradd.updateOne(query, insertData);
      res.json(result);
    });

    // /product/add

    app.post("/product/add", async (req, res) => {
      const productdata = req.body;
      const result = await productadd.insertOne(productdata);
      res.json(result);
    });

    app.get("/allproduct/show", async (req, res) => {
      const result = productadd.find({});
      const coures = await result.toArray();
      res.send(coures);
    });

    //user/review

    app.post("/user/review", async (req, res) => {
      const reviews = req.body;
      const result = await userreviews.insertOne(reviews);
      res.json(result);
    });

    app.get("/reviewdata/show", async (req, res) => {
      const result = userreviews.find({});
      const coures = await result.toArray();
      res.send(coures);
    });

    // /order/product

    app.post("/order/product", async (req, res) => {
      const oder = req.body;
      const result = await oderlist.insertOne(oder);
      res.json(result);
    });

    app.get("/oderlist", async (req, res) => {
      const cursor = oderlist.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete("/oderlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await oderlist.deleteOne(query);
      res.json(result);
    });

    app.put("/statusupdate/:id", async (req, res) => {
      const Id = req.params.id;
      console.log(Id);
      const data = req.body;
      const filter = { _id: ObjectId(Id) };
      // const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: parseInt(data.status),
        },
      };
      const result = await oderlist.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
  }
}

run().catch(() => console.log("error"));

app.listen(port, () => {
  console.log("server runing 5000");
});

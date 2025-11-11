const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const { ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.BILL_USER}:${process.env.BILL_PASSWORD}@cluster0.3lourmh.mongodb.net/?appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Utility Bill Management is Running!");
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db("utility_bill");
    const billsCollection = db.collection("bills");
    const myBillsCollection = db.collection("my-bills");
    const paymentsCollection = db.collection("payments");

    // resent bill post
    app.post("/recent-bills", async (req, res) => {
      const newBill = req.body;
      const result = await billsCollection.insertOne(newBill);
      res.send(result);
    });

    //  resent bill get
    app.get("/recent-bills", async (req, res) => {
      const cursor = billsCollection
        .find()
        .sort({
          date: -1,
        })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    // bill get
    app.get("/bills", async (req, res) => {
      const cursor = billsCollection.find().sort({
        date: -1,
      });
      const result = await cursor.toArray();
      res.send(result);
    });

    // bill post
    app.post("/bills", async (req, res) => {
      const newBill = req.body;
      const result = await billsCollection.insertOne(newBill);
      res.send(result);
    });

    // my bills get
    app.get("/my-bills", async (req, res) => {
      const cursor = myBillsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // bill details get
    app.get("/bills/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const result = await billsCollection.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });

    // bill  put
    app.put("/bills/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      console.log(id);
      console.log(data);
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const update = {
        $set: data,
      };
      const result = await billsCollection.updateOne(filter, update);
      res.send(result);
    });

    // Save new payment
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const result = await paymentsCollection.insertOne(payment);
      res.send({ success: true, result });
    });

    // Get user's payments (My Bills page)
    app.get("/payments", async (req, res) => {
      const email = req.query.email;
      if (!email) return res.status(400).send({ message: "Email required" });

      const result = await paymentsCollection.find({ email }).toArray();
      res.send({ success: true, result });
    });

    //  Update a payment
    app.put("/payments/:id", async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      const objectId = new ObjectId(id);

      const filter = { _id: objectId };
      const update = {
        $set: updateData,
      };

      const result = await paymentsCollection.updateOne(filter, update);
      res.send(result);
    });

    //  Delete a payment
    app.delete("/payments/:id", async (req, res) => {
      const { id } = req.params;
      const objectId = new ObjectId(id);
      const filter = { _id: objectId };
      const result = await paymentsCollection.deleteOne(filter);
      res.send({ success: true, result });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Utility Bill Server is running on port ${port}`);
});

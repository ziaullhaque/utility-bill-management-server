const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;
const { ObjectId } = require("mongodb");

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://assignmentUser:sXLEoS3aTqsgYaUz@cluster0.3lourmh.mongodb.net/?appName=Cluster0";

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

    // bill details get
    app.get("/bills/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const result = await billsCollection.findOne({ _id: new ObjectId(id) });
      res.send({ success: true, result });
    });
    // try {
    //   const query = { _id: new ObjectId(id) };
    //   const bill = await billsCollection.findOne(query);
    //   if (!bill) {
    //     return res.status(404).send({ message: "Bill not found" });
    //   }
    //   res.send(bill);
    // } catch (error) {
    //   console.error("Error fetching single bill:", error);
    //   res.status(500).send({ message: "Internal Server Error" });
    // }

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

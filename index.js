const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://assignmentUser:sXLEoS3aTqsgYaUz@cluster0.3lourmh.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const db = client.db("utility_bill");
    const billsCollection = db.collection("bills");

    app.post("/recent-bills", async (req, res) => {
      const newBill = req.body;
      const result = await billsCollection.insertOne(newBill);
      res.send(result);
    });

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
    app.post("/bills", async (req, res) => {
      const newBill = req.body;
      const result = await billsCollection.insertOne(newBill);
      res.send(result);
    });

    app.get("/bills", async (req, res) => {
      const cursor = billsCollection.find().sort({
        date: -1,
      });
      const result = await cursor.toArray();
      res.send(result);
    });

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

//     // Create Product APIs Get ( Find Single Documents )
// app.get("/products/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = { _id: new ObjectId(id) };
//   const result = await productsCollection.findOne(query);
//   res.send(result);
// });

// // Create Product APIs Post
// app.post("/products", async (req, res) => {
//   const newProduct = req.body;
//   const result = await productsCollection.insertOne(newProduct);
//   res.send(result);
// });

// // Create Product APIs Patch
// app.patch("/products/:id", async (req, res) => {
//   const id = req.params.id;
//   const updatedProduct = req.body;
//   const query = { _id: new ObjectId(id) };
//   const update = {
//     // $set: updatedProduct, all change
//     $set: {
//       name: updatedProduct.name,
//       price: updatedProduct.price,
//     },
//   };
//   const options = {};
//   const result = await productsCollection.updateOne(query, update, options);
//   res.send(result);
// });

// // Create Product APIs Delete
// app.delete("/products/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = { _id: new ObjectId(id) };
//   const result = await productsCollection.deleteOne(query);
//   res.send(result);
// });

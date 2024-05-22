const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 5000;
app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

client.connect()
  .then(() => {
    console.log("Connected to MongoDB");
    const db = client.db("curd");
    const usersCollection = db.collection("datas");

    app.use(bodyParser.json());

    app.post("/submitForm", async (req, res) => {
      const poda = req.body;
      await usersCollection.insertOne(poda);
      res.status(201).json({ message: "User created successfully" });
    });

    app.get("/users", async (req, res) => {
      const users = await usersCollection.find({}).toArray();
      res.json(users);
    });

    app.put("/users/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;

        if (!ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid userId" });
        }

        const updatedUserData = req.body;
        const filter = { _id: new ObjectId(userId) };
        const updateDoc = {
          $set: updatedUserData,
        };

        await usersCollection.updateOne(filter, updateDoc);
        res.status(200).json({ message: "User data updated successfully" });
      } catch (error) {
        console.error("Error updating user data:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.delete("/users/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;

        if (!ObjectId.isValid(userId)) {
          return res.status(400).json({ message: "Invalid userId" });
        }

        await usersCollection.deleteOne({ _id: new ObjectId(userId) });
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    client.close();
  });

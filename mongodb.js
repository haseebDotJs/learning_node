const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// Replace the placeholder with your Atlas connection string
const uri = "mongodb://127.0.0.1:27017";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const databaseName = "task-manager";

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    const connectedClient = await client.connect();

    const db = connectedClient.db(databaseName);

    const usersCollection = db.collection("users");
    const tasksCollection = db.collection("tasks");

    // const doc = { name: "Haseeb", age: 20, _id: 1 };

    // const result = await users.insertOne(doc);

    // INERTING DATA IN DB

    // const tasks = [
    //   {
    //     task: "do breakfast",
    //     completed: false,
    //   },
    //   {
    //     task: "do office work",
    //     completed: false,
    //   },
    //   {
    //     task: "learn nodejs",
    //     completed: false,
    //   },
    // ];

    // const result = await tasksCollection.insertMany(tasks);

    // QUERYING USERS/TASKS

    // const lastTask = await tasksCollection.findOne({
    //   _id: new ObjectId("656f85ee0987c5fe05b4d492"),
    // });

    // const unCompletedTasks = await tasksCollection
    //   .find({ completed: false })
    //   .toArray();
    // console.log("____TASKS", lastTask, unCompletedTasks);

    // UPDATING TASKS
    // const result = await tasksCollection.updateMany(
    //   {
    //     completed: false,
    //   },
    //   {
    //     $set: {
    //       completed: true,
    //     },
    //   }
    // );
    // console.log("_____result", result);

    // DELETING TASKS
    // const result = await tasksCollection.deleteOne({
    //   _id: new ObjectId("656f85ee0987c5fe05b4d490"),
    // });
    const result = await usersCollection.deleteMany({ age: 20 });
    console.log("_____result", result);
  } catch (e) {
    console.log("Mongodb failed to connect");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

run();

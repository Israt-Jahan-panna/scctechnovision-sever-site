const express = require('express');
var cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4200
// midelwire
app.use(cors());
app.use(express.json());

// mongodb connections 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.j0yhois.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
    //   await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
      // await client.close();
    }
  }


  const userCollection = client.db('sccTechnovision').collection('users')

  // user api
  app.get('/users' , async(req , res ) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/users', async (req , res) =>{
      const users = req.body ;
    // insert email if user dosenot exists 
    const query ={email:users.email}
    const existingUser = await  userCollection.findOne(query);
    if(existingUser){
      return res. send({message: 'user alreaady exixt,', insertedId:null})
    }
      console.log(users);
      const result = await userCollection.insertOne(users);
      res.send(result)
    })

    // added new task
const taskCollection = client.db("sccTechnovision").collection("addtask");

app.get('/tasks' , async(req , res ) => {
  const cursor = taskCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

// add new tasks
app.post('/tasks', async (req , res) =>{
    const addedNewTask = req.body ;
    console.log(addedNewTask);
    const result = await taskCollection.insertOne(addedNewTask);
    res.send(result)
})

  // // Update task by ID 
  app.get('/tasks/:id' , async(req , res ) => {
    const id =req.params.id ;
  const query = {_id : new ObjectId (id)}
  const result = await taskCollection.findOne(query)
  res.send(result)
  })

  app.put('/tasks/:id',async(req , res ) =>{
    const id = req.params.id;
    const filter = {_id : new ObjectId (id)}
    const updatePost = req.body;
    const tasks = {
      $set:{
        creatorEmail:updatePost.creatorEmail,
        taskTitle:updatePost.taskTitle,
        deadline:updatePost.deadline,
        description:updatePost.description,
        priority:updatePost.priority
        
      }
    }
    const result = await taskCollection.updateOne(filter,jobs);
    res.send(result);
  })




app.post('/tasks', async (req, res) => {
try {
    const { creatorEmail, taskTitle, deadline, description, priority } = req.body;

    // Use these values to create the document you want to insert
    const taskDocument = {
      creatorEmail,
      taskTitle,
        deadline,
        description,
        priority
    };

    const result = await taskCollection.insertOne(jobDocument);
    res.send(result);
    
} catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
}
});

  run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('sccTechnovision ')
  })
  
  app.listen(port, () => {
    console.log(`sccTechnovision  listening on port ${port}`)
  })



  
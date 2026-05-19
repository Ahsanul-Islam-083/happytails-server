const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config();

const uri = process.env.MONGODB_URI;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());





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
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const db = client.db("happytailsdb");
    const petsCollection = db.collection("pets"); 
    


    app.get('/allPets', async (req, res)=> {
      const result = await petsCollection.find().toArray();
      res.send(result);
    });

    app.get('/allPets/:petId', async (req, res)=> {
      const id = req.params.petId;
      const query = {_id: new ObjectId(id)};
      const result = await petsCollection.findOne(query);
      res.send(result);
    })




    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello World!');
}); 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// nK0265ES3dBluoAj happytails
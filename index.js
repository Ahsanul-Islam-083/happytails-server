const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { jwtVerify, createRemoteJWKSet } = require('jose-cjs');
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


const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

const verifyToken = async (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized Access' });
  }
  try {
    const { payload } = await jwtVerify(token, JWKS);
    req.user = payload;
    next();
  } catch (error) {
    console.error('Token validation failed:', error)
    return res.status(403).json({ message: "Forbidden" })
  }
}




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    const db = client.db("happytailsdb");
    const petsCollection = db.collection("pets");
    const adoptionApplicationsCollection = db.collection("adoptionApplications");



    app.get('/allPets', async (req, res) => {
      const result = await petsCollection.find().toArray();
      res.send(result);
    });

    app.get('/featuredPets', async (req, res) => {
      const result = await petsCollection.find().limit(6).toArray();
      res.send(result);
    });

    app.get('/allPets/:petId', async (req, res) => {
      const id = req.params.petId;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.findOne(query);
      res.send(result);
    })

    app.delete('/allPets/:petId', async (req, res) => {
      const id = req.params.petId;
      const query = { _id: new ObjectId(id) };
      const result = await petsCollection.deleteOne(query);
      res.send(result);
    })


    app.patch('/allPets/:petId', async (req, res) => {
      const id = req.params.petId;
      const updatedPet = req.body;

      const result = await petsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedPet }
      )
      res.send(result);
    })

    app.post('/addPet', async (req, res) => {
      const pet = req.body;
      const result = await petsCollection.insertOne(pet);
      res.send(result);
    })


    app.get('/myPostsList/:userId', async (req, res) => {
      const { userId } = req.params;
      const result = await petsCollection.find({ userId: userId }).toArray()
      res.send(result)
    })

    // to Create an Adoption Request 
    app.post('/adopt', async (req, res) => {
      const applicationData = req.body;
      applicationData.status = 'pending';
      const result = await adoptionApplicationsCollection.insertOne(applicationData);
      res.send(result);
    })

    // to get User's Adoption Requests
    app.get('/my-requests/:email', async (req, res) => {
      const email = req.params.email;
      const result = await adoptionApplicationsCollection.find({ userEmail: email }).toArray();
      res.send(result);
    })

    app.delete('/my-requests/:id', async (req, res) => {
      const id = req.params.id;
      const result = await adoptionApplicationsCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    })

    app.get('/pet-requests/:petId', async (req, res) => {
      const { petId } = req.params;
      const result = await adoptionApplicationsCollection.find({ petId: petId }).toArray();
      res.send(result);
    })

    app.patch('/adopt-status/:id', async (req, res) => {
      const { id } = req.params;
      const { status, petId } = req.body;

      const updateRequestStatus = await adoptionApplicationsCollection.updateOne(
        {_id: new ObjectId(id)},
        {$set: {status: status}}
      )

      // to update pet status
      if (status === 'approved') {
        await petsCollection.updateOne(
          {_id: new ObjectId(petId)},
          {$set: {status: 'adopted'}}
        )
      };

      await adoptionApplicationsCollection.updateMany(
        {petId: petId, _id: {$ne: new ObjectId(id)}},
        {$set: {status: 'rejected'}}
      );
      res.send(updateRequestStatus);
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
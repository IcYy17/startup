// const { MongoClient } = require('mongodb');
// const bcrypt = require('bcrypt');
// const uuid = require('uuid');
// const config = require('./dbConfig.json');

// const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
// const client = new MongoClient(url);
// const db = client.db('BRS');
// const userCollection = db.collection('shoes');


// // This will asynchronously test the connection and exit the process if it fails
// (async function testConnection() {
//   await client.connect();
//   await db.command({ ping: 1 });
// })().catch((ex) => {
//   console.log(`Unable to connect to database with ${url} because ${ex.message}`);
//   process.exit(1);
// });

// function getUser(email) {
//   return userCollection.findOne({ email: email });
// }

// function getUserByToken(token) {
//   return userCollection.findOne({ token: token });
// }

// async function createUser(email, password) {
//   // Hash the password before we insert it into the database
//   const passwordHash = await bcrypt.hash(password, 10);

//   const user = {
//     email: email,
//     password: passwordHash,
//     token: uuid.v4(),
//   };
//   await userCollection.insertOne(user);

//   return user;
// }

// app.get('/api/shoes', async (_req, res) => {
//     try {
//       const shoes = await collection.find({}).toArray();
//       res.json(shoes);
//     } catch (error) {
//       console.error('Error fetching shoes:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
  
//   app.get('/api/shoes/:id', async (req, res) => {
//     try {
//       const shoeId = req.params.id;
//       const shoe = await collection.findOne({ _id: ObjectId(shoeId) });
//       if (!shoe) {
//         res.status(404).json({ error: 'Shoe not found' });
//         return;
//       }
//       res.json(shoe);
//     } catch (error) {
//       console.error('Error fetching shoe:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
//   // Create a new shoe
//   app.post('/api/shoes', async (req, res) => {
//     try {
//       const newShoe = req.body;
//       const result = await collection.insertOne(newShoe);
//       res.json(result.ops[0]);
//     } catch (error) {
//       console.error('Error creating shoe:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });

// // Delete a shoe by ID
// app.delete('/api/shoes/:id', async (req, res) => {
//     try {
//       const shoeId = req.params.id;
//       const result = await collection.deleteOne({ _id: ObjectId(shoeId) });
//       if (result.deletedCount === 0) {
//         res.status(404).json({ error: 'Shoe not found' });
//         return;
//       }
//       res.json({ message: 'Shoe deleted successfully' });
//     } catch (error) {
//       console.error('Error deleting shoe:', error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   });
  
// module.exports = {
//   getUser,
//   getUserByToken,
//   createUser,
// };

const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json'); // Make sure this contains your MongoDB credentials

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = { connectToDatabase };

// const { MongoClient } = require('mongodb');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
// const config = require('./dbConfig.json');

// const url = `mongodb+srv://${userName}:${password}@${hostname}`;
// const client = new MongoClient(url);
const collection = client.db('authTest').collection('user');

app.use(cookieParser());
app.use(express.json());

// createAuthorization from the given credentials
app.post('/auth/create', async (req, res) => {
  if (await getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({
      id: user._id,
    });
  }
});

// loginAuthorization from the given credentials
app.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// getMe for the currently authenticated user
app.get('/user/me', async (req, res) => {
  authToken = req.cookies['token'];
  const user = await collection.findOne({ token: authToken });
  if (user) {
    res.send({ email: user.email });
    return;
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

function getUser(email) {
  return collection.findOne({ email: email });
}

async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid.v4(),
  };
  await collection.insertOne(user);

  return user;
}

function setAuthCookie(res, authToken) {
  res.cookie('token', authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

const port = 8080;
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// module.exports = {
//   getUser,
//   setAuthCookie,
//   createUser,
// };

const express = require('express');
const server = express();
const cors = require('cors');
const bodyParser = require('body-parser');

server.use(cors({ origin: '*' }));
server.use(bodyParser.json());

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://tasneem:0Ixc82sVBp54aoba@cluster0.sr7echm.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB Atlas connection string
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


server.get('/', (req, res) => {
  res.send('Welcome to the home route!');
});

server.post('/save-blog', async (req, res) => {
  try {
    const { title, text } = req.body;
    console.log(req)
    const blogData = {
      title: title,
      text: text,
    };

    await client.connect();
    const database = client.db('Facebook'); // Replace with your MongoDB database name
    const collection = database.collection('blogs');

    await collection.insertOne(blogData);

    console.log('Data saved successfully');
    res.status(200).send('Data saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

server.delete('/delete', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Facebook');
    const collection = database.collection('blogs');

    await collection.deleteMany({});

    console.log('All data deleted successfully');
    res.status(200).send('All data deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

server.get('/get-blogs', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('Facebook');
    const collection = database.collection('blogs');

    const blogs = await collection.find().toArray();

    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

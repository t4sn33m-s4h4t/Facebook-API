const express = require('express');
const server = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises; // Use fs.promises for async file operations

server.use(cors());
server.use(bodyParser.json());

// Handle GET request to the home route
server.get('/', (req, res) => {
  res.send('Welcome to the home route!');
});

// Handle POST request to save data to "blogs.txt"
server.post('/save-blog', async (req, res) => {
  try {
    const blogData = req.body;
    const blogDataString = JSON.stringify(blogData);
    const filePath = 'blogs.txt';

    await fs.appendFile(filePath, blogDataString + '\n');
    console.log('Data saved successfully');
    res.status(200).send('Data saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Handle DELETE request to delete all data
server.delete('/delete', async (req, res) => {
  try {
    const filePath = 'blogs.txt';
    await fs.writeFile(filePath, '', 'utf8');
    console.log('All data deleted successfully');
    res.status(200).send('All data deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Handle GET request to retrieve all blogs
server.get('/get-blogs', async (req, res) => {
  try {
    const filePath = 'blogs.txt';
    const data = await fs.readFile(filePath, 'utf8');
    const blogs = data.split('\n').filter(entry => entry.trim() !== '');
    const parsedBlogs = blogs.map(entry => JSON.parse(entry));
    res.status(200).json(parsedBlogs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 8080; // Use process.env.PORT for flexibility

server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

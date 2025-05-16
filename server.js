const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const port = 8080;

// Middleware for parsing JSON
app.use(express.json());

// MongoDB Connection URI
const mongoUsername = process.env.MONGO_USERNAME || 'root';
const mongoPassword = process.env.MONGO_PASSWORD || 'example';
const mongoHost = process.env.MONGO_HOST || 'mongodb';
const mongoPort = process.env.MONGO_PORT || '27017';
const mongoDatabase = process.env.MONGO_DATABASE || 'nodeapp';

const uri = `mongodb://${mongoUsername}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDatabase}?authSource=admin`;

let client;
let db;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
      console.log('Connected to MongoDB');
      db = client.db(mongoDatabase);
    }
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Root route
app.get('/', (req, res) => {
  res.send('<h1>SIT323 Task 9.1P: Node.js with MongoDB on Kubernetes</h1>');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// CRUD Operations

// Create - Add a new item
app.post('/api/items', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const result = await db.collection('items').insertOne(req.body);
    res.status(201).json({
      success: true,
      id: result.insertedId,
      item: req.body
    });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Read - Get all items
app.get('/api/items', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const items = await db.collection('items').find({}).toArray();
    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: error.message });
  }
});

// Read - Get a specific item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update - Update an item by ID
app.put('/api/items/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete - Delete an item by ID
app.delete('/api/items/:id', async (req, res) => {
  try {
    const db = await connectToMongoDB();
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    res.json({
      success: true,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
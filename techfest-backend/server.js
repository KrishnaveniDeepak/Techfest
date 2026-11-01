const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// 1. Explicit CORS Configuration for Netlify and local development
app.use(cors({
  origin: [
    'https://techfest-1.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parser Middleware
app.use(express.json());

// 3. API Routes
app.use('/api/events', require('./routes/events'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/registrations', require('./routes/registrations'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/techfest')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
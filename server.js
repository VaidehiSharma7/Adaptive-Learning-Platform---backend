const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// ✅ Connect to MongoDB
connectDB();

const app = express();

// ✅ Dynamic CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Body parser middleware
app.use(express.json());

// ✅ Logging middleware
app.use((req, res, next) => {
  console.log(`📥 Incoming request: ${req.method} ${req.url}`);
  next();
});

// ✅ Route imports
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const quizRoutes = require('./routes/quiz');
const submitRoutes = require('./routes/submit');

// ✅ Route usage
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/submit', submitRoutes);
// ✅ NEW: Instructor registration route
app.post('/api/register', async (req, res) => {
  const { name, email, role } = req.body;

  try {
    // You can later add MongoDB model logic here
    const newUser = { name, email, role };
    console.log('✅ Registered user:', newUser);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Adaptive Learning API is running');
});
// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});




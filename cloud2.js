const express = require('express');
const cors = require('cors');

console.log('Starting server...'); // Debug line

try {
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.get('/', (req, res) => {
    console.log('GET request received at /'); // Debug line
    res.json({ message: 'API is working!' });
  });
  
  // Error handling
  app.use((err, req, res, next) => {
    console.error('Error:', err); // Debug line
    res.status(500).json({ error: 'Server error' });
  });
  
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`); // Clear success message
    console.log('Try these endpoints:');
    console.log(`- GET http://localhost:${PORT}`);
    console.log(`- POST http://localhost:${PORT}/data`);
  });
  
} catch (error) {
  console.error('❌ Failed to start server:', error); // Debug line
}
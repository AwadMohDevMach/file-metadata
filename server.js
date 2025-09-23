const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer to store files in memory (for Vercel compatibility)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.use(helmet());
app.use(cors({ origin: '*' })); // Allow all origins for freeCodeCamp tests
app.use(morgan('combined'));
app.use(express.static('public'));

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  console.log('File upload attempt:', req.file); // Debugging log
  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Handle errors from multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log('Multer error:', err);
    return res.status(400).json({ error: 'File upload error' });
  }
  next(err);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
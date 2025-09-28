const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

// Configure multer to store uploaded files in /uploads
const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Route to serve index.html directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// POST endpoint expected by FreeCodeCamp tests: /api/fileanalyse
app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // رجع القيم زي ما هي من req.file عشان الاختبارات تعدي
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// A simple health route
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'File Metadata Microservice is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

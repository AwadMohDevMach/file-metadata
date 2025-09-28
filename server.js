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

  let fileName = req.file.originalname;
  try {
    // محاولة لإصلاح مشكلة الترميز مع أسماء الملفات العربية
    fileName = Buffer.from(fileName, 'latin1').toString('utf8');
  } catch (err) {
    // لو حصل خطأ نرجع الاسم زي ما هو
  }

  const { mimetype, size } = req.file;

  res.json({ name: fileName, type: mimetype, size });
});

// A simple health route
app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'File Metadata Microservice is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


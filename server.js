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
  limits: { fileSize: 1 * 1024 * 1024 } // 1MB limit to ensure Vercel compatibility
});

app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.static('public'));

// Handle CORS preflight requests
app.options('/api/fileanalyse', cors());

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  console.log('File upload attempt:', {
    fieldname: req.file?.fieldname,
    originalname: req.file?.originalname,
    mimetype: req.file?.mimetype,
    size: req.file?.size
  });

  if (!req.file) {
    console.log('No file uploaded');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Ensure filename is properly encoded
  const filename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');

  res.json({
    name: filename,
    type: req.file.mimetype,
    size: req.file.size
  });
});

// Handle multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log('Multer error:', err.message);
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
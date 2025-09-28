const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer with strict file size limit and memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 } // 500KB limit for Vercel
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
    console.log('No file uploaded or incorrect fieldname');
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Fix filename encoding for non-Latin characters
  let filename;
  try {
    filename = Buffer.from(req.file.originalname, 'latin1').toString('utf8');
  } catch (e) {
    console.log('Filename encoding error:', e.message);
    filename = req.file.originalname; // Fallback to original if encoding fails
  }

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
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  console.error('Server error:', err);
  res.status(500).json({ error: 'Server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 3000;

// Configure multer to store files in memory (better for Vercel)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.static('public'));

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) {
    return res.json({ error: 'No file uploaded' });
  }

  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
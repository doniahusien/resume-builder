const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const resumes = [];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage });

app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  next();
});

app.use('/uploads', express.static('uploads'));

app.post('/api/resumes', upload.single('file'), (req, res) => {
  try {
    console.log('Received a file upload request:');
    console.log('Request body:', req.body);
    console.log('Uploaded file details:', req.file);

    const resume = {
      ...JSON.parse(req.body.data), 
      file: req.file, 
    };

    resumes.push(resume);
    res.status(201).json({ message: 'Resume created successfully' });
  } catch (error) {
    console.error('An error occurred while processing the file upload:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/resumes', (req, res) => {
  res.json(resumes);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

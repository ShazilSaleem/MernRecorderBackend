const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/audio-recordings', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const recordingSchema = new mongoose.Schema({
  filename: String,
  path: String,
  date: { type: Date, default: Date.now },
});

const Recording = mongoose.model('Recording', recordingSchema);

// Storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route to handle audio uploads
app.post('/upload', upload.single('audio'), (req, res) => {
  const newRecording = new Recording({
    filename: req.file.filename,
    path: req.file.path,
  });

  newRecording.save().then(() => {
    res.status(200).json({ message: 'Audio uploaded successfully!' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

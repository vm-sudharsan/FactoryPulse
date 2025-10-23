const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mlController = require('../controllers/mlController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'analysis-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
    cb(null, true);
  } else {
    cb(new Error('Only CSV files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

router.post('/analyze', upload.single('file'), (req, res) => mlController.analyzeCSV(req, res));

router.post('/validate', upload.single('file'), (req, res) => mlController.validateCSV(req, res));

router.get('/health', (req, res) => mlController.checkMLService(req, res));

module.exports = router;

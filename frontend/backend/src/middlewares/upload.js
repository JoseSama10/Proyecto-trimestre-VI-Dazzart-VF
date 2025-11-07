const path = require('path');
const fs = require('fs');
const multer = require('multer');

const imgDir = path.join(__dirname, '../../public/img'); // ../public/img fuera de src

// Crear la carpeta si no existe
fs.mkdirSync(imgDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imgDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `producto-${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage });

module.exports = upload;

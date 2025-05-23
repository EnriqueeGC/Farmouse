const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuración del almacenamiento
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'productos', // Carpeta donde se guardarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png'], // CORRECTO: con guion bajo
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

// Crear middleware upload
const multer = require('multer');
const upload = multer({ storage });

module.exports = { cloudinary, upload, storage };
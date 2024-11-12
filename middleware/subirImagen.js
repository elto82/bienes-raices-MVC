import multer from "multer";
import path from "path";
import fs from "fs";
import { generarId } from "../helpers/tokens.js";

// Ruta de destino
const uploadDir = "./public/uploads";

// Verifica y crea la carpeta si no existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Usa la ruta definida para el almacenamiento
  },
  filename: function (req, file, cb) {
    cb(null, generarId() + path.extname(file.originalname)); // Genera el nombre del archivo
  },
});

const upload = multer({ storage });
export default upload;

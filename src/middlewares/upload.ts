import multer from "multer";

const storage = multer.memoryStorage();

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"];

export const MAX_FOTOS_POR_ORDEN = 5;

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (TIPOS_PERMITIDOS.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Solo se permiten imágenes JPEG, PNG o WEBP"));
    }
  },
});

export default upload;

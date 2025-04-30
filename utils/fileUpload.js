const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const UPLOAD_DIR = "./uploads";
const IMAGE_DIR = path.join(UPLOAD_DIR, "images");
const MAX_FILE_SIZE = 50 * 1024 * 1024; 
const ALLOWED_MIMETYPES = new Set([
  "image/png",
  "image/jpg",
  "image/jpeg",
  "application/pdf",
]);

async function ensureDirectoriesExist() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }

  try {
    await fs.access(IMAGE_DIR);
  } catch {
    await fs.mkdir(IMAGE_DIR, { recursive: true });
  }
}

// Initialize directories
ensureDirectoriesExist().catch(console.error);

// Storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      // Double-check directories exist
      await ensureDirectoriesExist();
      cb(null, IMAGE_DIR);
    } catch (error) {
      cb(new Error("Could not access upload directory"));
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileExtension = path.extname(file.originalname);
    const newFilename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    cb(null, newFilename);
  },
});

const profileImageUpload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Only allow image types for profile pictures
    if (!["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
      return cb(
        new Error(
          "Invalid file type. Only PNG, JPG, and JPEG are allowed for profile images"
        ),
        false
      );
    }
    cb(null, true);
  },
}).single("profileImage");

const profileImageMiddleware = (req, res, next) => {
  profileImageUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        // Multer-specific errors
        switch (err.code) {
          case "LIMIT_FILE_SIZE":
            return res.status(400).json({
              status: "error",
              message: `File too large. Maximum size is ${
                MAX_FILE_SIZE / (1024 * 1024)
              }MB`,
            });
          case "LIMIT_UNEXPECTED_FILE":
            return res.status(400).json({
              status: "error",
              message: "Unexpected field name for file upload",
            });
          default:
            return res.status(400).json({
              status: "error",
              message: `Upload error: ${err.message}`,
            });
        }
      }

      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  
    next();
  });
};


module.exports = {profileImageMiddleware };

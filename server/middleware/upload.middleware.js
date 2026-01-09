import multer from 'multer';
import path from 'path';
import fs from 'fs';

/**
 * UPLOAD CONFIGURATION
 * Handles file storage, naming, and security filtering
 */

// 1. Directory Creator Helper (Ensure folders exist)
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// 2. Storage Strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Dynamic path selection based on fieldname
    const folderMap = {
      'document': 'uploads/documents/',
      'profilePicture': 'uploads/profile_pictures/',
      'companyLogo': 'uploads/company_logos/'
    };

    uploadPath = folderMap[file.fieldname] || 'uploads/misc/';
    
    ensureDirectoryExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Sanitize filename and add unique timestamp to prevent overwriting
    const nameWithoutExt = path.parse(file.originalname).name.replace(/\s/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = path.extname(file.originalname).toLowerCase();
    
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${extension}`);
  }
});

// 3. Security: File Filter
const fileFilter = (req, file, cb) => {
  // Define allowed extensions and mimetypes
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
  const allowedMimetypes = ['image/jpeg', 'image/png', 'application/pdf'];

  const extension = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  // Double validation (Extension + Mimetype)
  if (allowedExtensions.includes(extension) && allowedMimetypes.includes(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format galat hai! Sirf JPG, PNG aur PDF files allow hain.'), false);
  }
};

// 4. Multer Instance
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // Default 5MB for security
  },
  fileFilter: fileFilter
});

/**
 * Global Error Handler for Uploads
 * Specific responses for Multer errors
 */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    let message = 'File upload error.';
    
    if (err.code === 'LIMIT_FILE_SIZE') {
      const size = process.env.MAX_FILE_SIZE ? 'config ke mutabiq' : '5MB';
      message = `File bohot badi hai! Maximum size ${size} allowed hai.`;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Ghalat field name use kiya gaya hai upload ke liye.';
    }

    return res.status(400).json({ success: false, message });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || 'File upload ke dauran error aaya.'
    });
  }

  next();
};
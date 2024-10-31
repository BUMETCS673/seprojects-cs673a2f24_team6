// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define allowed file types
const ALLOWED_FILE_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create year/month directories for better organization
        const now = new Date();
        const targetDir = path.join(
            uploadDir,
            now.getFullYear().toString(),
            (now.getMonth() + 1).toString().padStart(2, '0')
        );

        // Create directory if it doesn't exist
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        cb(null, targetDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = ALLOWED_FILE_TYPES[file.mimetype];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG and GIF files are allowed.'), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE
    }
});

// Error handler middleware
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            });
        }
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: err.message
        });
    }
    if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

// Function to delete file
const deleteFile = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    } catch (error) {
        console.error('Error deleting file:', error);
    }
};

// Create an upload middleware that includes error handling
const createUploadMiddleware = (fieldName, maxCount = 1) => {
    return [
        upload.array(fieldName, maxCount),
        handleUploadError,
        (req, res, next) => {
            // Add file URLs to request
            if (req.files) {
                req.fileUrls = req.files.map(file => 
                    `/uploads/${path.relative(uploadDir, file.path)}`
                );
            }
            next();
        }
    ];
};

module.exports = {
    uploadSingle: (fieldName) => createUploadMiddleware(fieldName, 1),
    uploadMultiple: (fieldName, maxCount) => createUploadMiddleware(fieldName, maxCount),
    deleteFile,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE
};
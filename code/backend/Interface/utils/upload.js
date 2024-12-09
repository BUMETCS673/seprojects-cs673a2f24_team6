// utils/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define allowed file types
const ALLOWED_FILE_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Create base uploads directory
const createUploadDir = (type) => {
    const uploadDir = path.join(__dirname, `../public/${type}`);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return uploadDir;
};

// Configure storage
configureStorage = (type) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadDir = createUploadDir(type);
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const userId = req.user.id;
            const timestamp = Date.now();
            const ext = ALLOWED_FILE_TYPES[file.mimetype];
            cb(null, `${userId}.${ext}`);
        }
    });
};

// File filter
fileFilter = (req, file, cb) => {
    if (ALLOWED_FILE_TYPES[file.mimetype]) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG file are allowed.'), false);
    }
};

// Create upload middleware
createUploader = (type) => {
    return multer({
        storage: configureStorage(type),
        fileFilter: fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    }).single(type);
};

// Delete old file
deleteFile = (filePath) => {
    if (filePath && fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
        });
    }
};

// Handle upload errors
handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                err: `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
            });
        }
        return res.status(400).json({ err: err.message });
    }
    if (err) {
        return res.status(400).json({ err: err.message });
    }
    next();
};

module.exports = {
    uploadSingle: (type) => [createUploader(type), handleUploadError],
    deleteFile,
    ALLOWED_FILE_TYPES,
    MAX_FILE_SIZE
};
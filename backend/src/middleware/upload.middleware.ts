import path from 'node:path';
import multer from 'multer';

const avatarDir = path.resolve(process.cwd(), 'uploads', 'avatars');

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, avatarDir);
  },
  filename(req, file, callback) {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    callback(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  }
});

export const avatarUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter(req, file, callback) {
    if (!file.mimetype.startsWith('image/')) {
      callback(new Error('只能上传图片文件'));
      return;
    }

    callback(null, true);
  }
});

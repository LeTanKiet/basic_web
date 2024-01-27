import express from 'express';
import multer from 'multer';
import path from 'path';
import { authentication, checkAdminPermission } from '../middlewares/auth.js';
import { db } from '../models/index.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/uploads');
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

const fileRoutes = () => {
  const router = express.Router();

  router.get('/upload/test', authentication, (req, res) => {
    res.render('upload', {
      layout: 'no-header-footer-layout',
    });
  });

  router.post('/upload', authentication, upload.single('upload_image'), async (req, res) => {
    try {
      const { userId } = req.context;

      multer().single('upload_image')(req, res, async function (err) {
        if (req.fileValidationError) {
          return res.status(400).send({ message: 'Validation fail' });
        } else if (!req.file) {
          return res.status(400).send({ message: 'Please select an image to upload' });
        } else if (err instanceof multer.MulterError) {
          return res.status(400).send({ message: 'err.message' });
        }

        await db.oneOrNone('UPDATE users SET avatar = $1 WHERE id = $2;', [req.file.filename, userId]);

        return res.redirect('/profile');
      });
    } catch (error) {
      return res.status(500).send({ message: 'Internal server error.' });
    }
  });

  return router;
};

export default fileRoutes;

import express from 'express';
import multer from 'multer';
import path from 'path';
import { authentication, checkAdminPermission } from '../middlewares/auth.js';

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

  router.get('/upload/test', authentication, checkAdminPermission, (req, res) => {
    res.render('upload', {
      layout: 'no-header-footer-layout',
    });
  });

  router.post('/upload', upload.single('upload_image'), (req, res) => {
    multer().single('upload_image')(req, res, function (err) {
      if (req.fileValidationError) {
        return res.render('upload', {
          layout: 'no-header-footer-layout',
          message: 'Validation fail',
        });
      } else if (!req.file) {
        return res.render('upload', {
          layout: 'no-header-footer-layout',
          message: 'Please select an image to upload',
        });
      } else if (err instanceof multer.MulterError) {
        return res.render('upload', {
          layout: 'no-header-footer-layout',
          message: err.message,
        });
      }

      return res.render('upload', {
        layout: 'no-header-footer-layout',
        message: `You have uploaded this image: `,
        filename: req.file.filename,
      });
    });
  });

  return router;
};

export default fileRoutes;

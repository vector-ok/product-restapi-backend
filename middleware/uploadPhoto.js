const formidable = require('formidable');

module.exports = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) throw err;
    res.status(200).json({
      message: 'file uploaded',
      info: files
    });
    // res.write('file uploaded');
    // res.end();
  });
  next();
};
// const multer = require('multer');
// const upload = multer({dest: __dirname + 'uploads/images'});

// const cloudinary = require('cloudinary').v2;
// const fs = require('fs');
// const { cloudIt, pool } = require('../services/db');
// const poolConfig = require('../services/config');

// const { cloudIt } = cloudinaryConfig;
// const { pool } = poolConfig;

// const storageHandle = (req, file, cb) => {
//   cb(null, 'controllers/uploads');
// };
// const fileHandle = (req, file, cb) => {
//   console.log(file);
//   cb(null, file.originalname);
// };
// const storage = multer.diskStorage({
//   destination: storageHandle,
//   filename: fileHandle
// });

// const MIME_TYPES = {
//   'image/jpg': 'jpg',
//   'image/jpeg': 'jpeg',
//   'image/png': 'png'
// };
//
// const storageHandle = (req, file, callback) => {
//   callback(null, 'uploads');
// };
// const fileHandle = (req, file, callback) => {
//   const name = file.originalname.split(' ').join('_');
//   const extension = MIME_TYPES[file.mimetype];
//   callback(null, `${name + Date.now()}.${extension}`);
// };
// const storage = multer.diskStorage({
//   destination: storageHandle,
//   filename: fileHandle
// });
// module.exports = multer({ storage }).single('image');

// module.exports = (req, res) => {
//   const upload = multer({ storage }).single('images');
//   upload(req, res, (err) => {
//     if (err) {
//       return res.send(err);
//     }
//     //  return res.json(req.file); // file uploaded to server
//     console.log('file uploaded to server');
//     console.log(req.file);
//
//     // Send file to Cloudinary
//     cloudinary.config({
//       cloud_name: cloudIt.CLOUD_NAME,
//       api_key: cloudIt.API_KEY,
//       api_secret: cloudIt.API_SECRET
//     });
//     const { path } = req.file;
//     const uniqueFilename = new Date().toISOString();
//
//     cloudinary.uploader.upload(
//       path,
//       { puplic_id: `gifs/${uniqueFilename}`, tags: 'gifs' },
//       (error, image) => {
//         if (error) return res.send(error);
//         console.log('file uploaded to cloudinary');
//
//         // remove file from server
//         fs.unlinkSync(path);
//
//         pool.query('INSERT INTO orders(imageUrl) VALUES($1) RETURNING *', [image.url]);
//
//         if (error) {
//           throw error;
//         }
//         return res.status(201).json(image);
//
//         // return image details
//       }
//     );
//     return console.log('upload successful');
//   });
// };

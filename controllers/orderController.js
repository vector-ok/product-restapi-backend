// const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const formidable = require('formidable');

const { pool } = require('../services/db');
const { cloudIt } = require('../services/config');

// Send file to Cloudinary
cloudinary.config({
  cloud_name: cloudIt.CLOUD_NAME,
  api_key: cloudIt.API_KEY,
  api_secret: cloudIt.API_SECRET
});

const orderPost = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) throw err;

    // the next line is only neccesary for directly saving imag eto database. not needed.
    fs.readFile(files.imageUrl.path, 'hex', (err1, imgData) => {
      // imgData = `\\x${imgData}`; image data for sending image straight to db
      if (err1) throw err1;

      const data = {
        product: fields.product,
        description: fields.description,
        imageUrl: files.imageUrl.path,
        imageName: files.imageUrl.name
      };

      const { path } = files.imageUrl;
      const trimFileName = data.imageName.split(' ').join('_');
      const namePart = trimFileName.split('.')[0];
      const extensionPart = trimFileName.split('.')[1];
      const uniqueFilename = `${namePart + Date.now()}.${extensionPart}`;

      cloudinary.uploader.upload(
        path,
        { puplic_id: `gifs/${uniqueFilename}`, tags: 'gifs' },
        (error, image) => {
          if (error) res.send(error);

          // remove file from server
          fs.unlinkSync(path);

          pool.connect((err2, client, done) => {
            const query = 'INSERT INTO orders(product, description, imageUrl) VALUES($1,$2,$3) RETURNING *';
            const values = [data.product, data.description, image.secure_url];

            client.query(query, values, (error2) => {
              done();
              if (error2) {
                throw error2;
              } else {
                return res.status(201).json({
                  status: 'success',
                  message: 'All good! Product created successfully',
                  imageUrl: image.secure_url,
                  info: data
                });
              }
            });
          });
        }
      );

      // Alternative. The following code stores the image directly on the database. Not a good idea.
      // const data = {
      //   product: fields.product,
      //   description: fields.description,
      //   imageUrl: fields.name,
      //   img: files.imageUrl.path
      // };
      // pool.connect((err, client, done) => {
      // const query = 'INSERT INTO orders(product, description, img) VALUES($1,$2,$3) RETURNING *';
      //   const values = [data.product, data.description, imgData];
      //
      //   client.query(query, values, (error) => {
      //     done();
      //     if (error) {
      //       throw error;
      //     } else {
      //       res.status(201).json({
      //         status: 'success',
      //         message: 'product created successfully',
      //         info: data
      //       });
      //     }
      //   });
      // // });
      // });
    });
  });
};

// update order
const orderPatch = (req, res) => {
  const form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) throw err;

    const data = {
      product: fields.product,
      description: fields.description,
      imageUrl: files.imageUrl,
      imageName: files.imageUrl.name
    };

    const { path } = files.imageUrl;
    const trimFileName = data.imageName.split(' ').join('_');
    const namePart = trimFileName.split('.')[0];
    const extensionPart = trimFileName.split('.')[1];
    const uniqueFilename = `${namePart + Date.now()}.${extensionPart}`;

    cloudinary.uploader.upload(
      path,
      { puplic_id: `gifs/${uniqueFilename}`, tags: 'gifs' },
      (error, image) => {
        if (error) res.send(error);

        // remove file from server
        fs.unlinkSync(path);

        pool.connect((err2, client, done) => {
          const result = 'UPDATE orders SET product=$1, description=$2, imageUrl=$3 WHERE id=$4 RETURNING *';
          const values = [data.product, data.description, image.secure_url, req.params.id];

          client.query(result, values, (error2) => {
            done();

            if (error2) {
              throw error2;
            } else {
              res.status(201).json({
                status: 'success',
                message: 'Product successfully updated',
                info: data
              });
            }
          });
        });
      }
    );
  });
};

const orderGetAll = (req, res) => {
  pool.connect((err, client, done) => {
    // const query = 'SELECT * FROM orders ORDER BY created';
    const query = 'SELECT * FROM orders';
    client.query(query, (error, result) => {
      done();
      if (error) {
        res.status(400).json({ error });
      }
      if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No order found'
        });
      } else {
        res.status(200).json({
          status: 'Success',
          orders: result.rows
        });

        // for images directly on db.
        // const imageName = '/tmp/foo.jpg';
        // const imageAddress = result.rows[0].img;
        // fs.writeFile(imageName, imageAddress);
        // res.writeHead(200, { 'content-Type': 'text/html' });
        // res.write('<h3>All good.</h3>');
        // res.write('<img src="/tmp/foo.jpg" alt="" />');
        // res.status(200).json({
        //   status: 'Successful',
        //   orders: result.rows
        // });
      }
    });
  });
};

const orderGetOne = (req, res) => {
  pool.connect((err, client, done) => {
    const query = 'SELECT * FROM orders WHERE id=$1';
    const values = [req.params.id];
    client.query(query, values, (error, result) => {
      done();
      if (error) throw error;
      if (result.rows < '1') {
        res.status(404).send({
          status: 'Failed',
          message: 'No order found'
        });
      } else {
        res.status(200).json({
          status: 'Success',
          orders: result.rows
        });
      }
    });
  });
};

// delete order. Using try catch
const orderDelete = (async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM orders WHERE id = $1', [req.params.id]);

    if (result.rowCount < '1') {
      return res.status(400).json({
        message: 'record not found!'
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'All good! Order successfully deleted'
    });
  } catch (error) {
    res.status(400).json({
      status: 'Oops! Something went wrong.',
      message: error
    });
  }
  return next();
});

module.exports = {
  orderPost,
  orderPatch,
  orderGetAll,
  orderGetOne,
  orderDelete
};

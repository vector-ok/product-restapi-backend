const express = require('express');
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/add', auth, ctrl.orderPost);
router.patch('/:id', auth, ctrl.orderPatch);
router.get('/', auth, ctrl.orderGetAll);
router.get('/:id', auth, ctrl.orderGetOne);
router.delete('/:id', auth, ctrl.orderDelete);

module.exports = router;

let express = require('express');
let router = express.Router();

const imgSrvc = require('../services/ImageService')

router.post('/create', imgSrvc.create);

router.get('/test', imgSrvc.test);

module.exports = router;
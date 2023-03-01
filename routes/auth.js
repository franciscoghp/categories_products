const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { login } = require('../controllers/auth');

const router = Router();

router.post('/login',[
    check('user', 'The user is required').not().isEmpty(),
    check('password', 'The password is required').not().isEmpty(),
    validarCampos
],login );

module.exports = router;
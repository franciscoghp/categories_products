const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');

const { postProduct,
        getAllProducts,
        getProduct,
        putProduct, 
        deleteProduct, 
        getProductById,
        getCSV} = require('../controllers/productos');

const router = Router();

/**
 * {{url}}/api/products
 */

//  Obtener todas las productos - publico
router.get('/', getAllProducts );

//  Obtener todas las productos en archivo .csv
router.get('/csv', getCSV );

// Obtener una categoria por id - publico
router.get('/:id',[
    validarCampos,
], getProductById );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    check('sku','The sku is required').not().isEmpty(),
    validarCampos
], postProduct );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    // check('categoria','No es un id de Mongo').isMongoId(),
    validarCampos
], putProduct );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarCampos,
], deleteProduct);


module.exports = router;
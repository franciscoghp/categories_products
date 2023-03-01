const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');

const { postCategory,
        getAllCategories,
        putCategory, 
        deleteCategory, 
        getCategoryById} = require('../controllers/categorias');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', getAllCategories );

// Obtener una categoria por id - publico
router.get('/:id',[
    validarCampos,
], getCategoryById );

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [ 
    check('nombre_corto','El nombre corto es obligatorio').not().isEmpty(),
    validarCampos
], postCategory );

// Actualizar - privado - cualquiera con token válido
router.put('/:id',[
    check('nombre_corto','El nombre corto es obligatorio').not().isEmpty(),
    validarCampos
],putCategory );

// Borrar una categoria - Admin
router.delete('/:id',[
    validarCampos,
],deleteCategory);



module.exports = router;
const { Router } = require('express');
const { check } = require('express-validator');

const { obtenerProductos,
     crearProducto, 
     obtenerProductoById,
     actualizarProducto,
     borrarProducto} = require('../controllers/productos.controller');

const { existeProducto, existeCategoria } = require('../helpers/db-validators');

const { 
    validarCampos, 
    validarJWT, 
    esAdminRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id',[
    check('id', 'No es un Id valido para un producto').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], obtenerProductoById)

router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','La categoria es obligatorio').not().isEmpty(),
    check('categoria','La categoria no es un ID valido').isMongoId(),
    check('categoria').custom( existeCategoria ),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un Id valido para un producto').isMongoId(),
    check('categoria','La categoria no es un ID valido').isMongoId(),
    check('precio','El precio no puede estar vacio').not().isEmpty(),
    check('id').custom( existeProducto ),
    check('categoria').custom( existeCategoria ),
    validarCampos
], actualizarProducto);

router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un Id valido para un producto').isMongoId(),
    check('id').custom( existeProducto ),
    validarCampos
], borrarProducto);

module.exports = router;
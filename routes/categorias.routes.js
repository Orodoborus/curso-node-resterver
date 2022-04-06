const { Router } = require('express');
const { check } = require('express-validator');

const { 
    esRoleValido,
    emailExiste,
    existeUsuarioPorID, 
    existeCategoria } = require('../helpers/db-validators');

const { validarCampos, validarJWT, esAdminRole } = require('../middlewares');

const { 
    crearCategoria, 
    obtenerCategorias, 
    obtenerCategoriaById, 
    actualizarCategoria,
    borrarCategoria} = require('../controllers/categorias.contoller');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener una categoria por Id - publico
router.get('/:id', [
    check('id','El ID no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], obtenerCategoriaById);

//Crear una nueva categoría - privado - cualquier persona con un token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar una categoría existente - privado - cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('id','El ID no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], actualizarCategoria);

//Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','El ID no es valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
], borrarCategoria);


module.exports = router;
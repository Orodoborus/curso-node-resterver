const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { cargarArchivo, 
    actualizarImagen, 
    mostrarImg, 
    actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPemitidas } = require('../helpers/db-validators');
const validarArchivoSubir = require('../middlewares/validar-archivo');

const router = Router();

router.get('/:coleccion/:id', [
    check('id','El Id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPemitidas( c, ['usuarios','productos'])),
    validarCampos
], mostrarImg)

router.post('/',validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id','El Id debe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPemitidas( c, ['usuarios','productos'])),
    validarCampos
], actualizarImagenCloudinary);

module.exports = router;
const validaCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validar.jwt');
const validaRoles = require('../middlewares/validar-roles');
const validaArchivoSubir = require('../middlewares/validar-archivo');


module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles,
    ...validaArchivoSubir
}


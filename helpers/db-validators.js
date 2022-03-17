const Role = require('../models/role');
const Usuario = require('../models/user');

const esRoleValido = async (rol = '') => {
    //Verifica si el role existe
    const existeRole = await Role.findOne({rol});
    if(!existeRole){
        throw new Error(`El rol ${rol} no está registrado en la base de datos.`)
    }
}

const emailExiste = async (correo = '') => {
    //verificar si el correo existe
    const existeEmail = await Usuario.findOne( {correo} );
    if(existeEmail){
        throw new Error(`El correo; ${correo}, ya está registrado.`)
    }
}

const existeUsuarioPorID = async (id = '') => {
    //revisa si existe usuario con el ID
    const existeUsuario = await Usuario.findById( id );
    if(!existeUsuario){
        throw new Error(`El ID: ${id}, no existe.`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID
}
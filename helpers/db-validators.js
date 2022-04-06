const { Categoria, Producto } = require('../models');
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
        throw new Error(`El usuario con ID: ${id}, no existe.`);
    }
}

const existeCategoria = async (id = '') => {
    //revisa si existe categoria con el ID
    const existeCategoria = await Categoria.findById( id );
    if(!existeCategoria){
        throw new Error(`La categoria con ID: ${id}, no existe.`);
    }
}

const existeProducto = async (id = '') => {
    //revisa si existe producto con el ID
    const existeProducto = await Producto.findById( id );
    if(!existeProducto){
        throw new Error(`El producto con ID: ${id}, no existe.`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoria,
    existeProducto
}
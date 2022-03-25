const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/user');

const usuariosGet = async (req = request, res = response) => {

    // const { q, nombre = 'no name', apikey, page = 1, limit } = req.query;
    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async (req, res = response) => {
    
    const{ id } = req.params;
    const { _id, password, google, correo, ...user } = req.body;

    //TODO validar contra db
    if( password ){
        //Encriptar la contraseña del
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt ); 
    }

    const usuario = await Usuario.findByIdAndUpdate( id, user );

    res.json({
        usuario
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( { nombre, correo, password, rol } );

    //Encriptar la contraseña del
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );

    //Guardar en DB
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;
    
    //Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete(id);
    
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
    
    //const usuarioAutenticado = ?? (ES UNA TAREA)
    const usuarioAutenticado = req.usuarioAuth;

    res.json({
        usuario,
        usuarioAutenticado
    });
}

const ususariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    ususariosPatch
}
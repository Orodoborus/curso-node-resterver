const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');


const validarJWT = async ( req = request, res = response, next ) => {
    const token = req.header('x-token');

    if( !token ){
        return res.status(401).json({ 
            msg: ' No hay token en la peticion'
        });
    }

    try{
        //leer el uid dentro del token
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuarioAuth = await Usuario.findById(uid);

        //validacion si uid es undefined
        if( !usuarioAuth )
            return res.status(401).json({
                msg: 'Token no valido, usuario no existe en DB'
            })

        //verificacion de usuario activo
        if( !usuarioAuth.estado )
            return res.status(401).json({ 
                msg: 'Token no valido - ususario con estado: false'
            })
        
        req.usuarioAuth = usuarioAuth;

        next();

    }catch(e){
        console.log(e);
        res.status(401).json({
            mgs: 'Token no valido'
        })
    }
}

module.exports = {
    validarJWT
}

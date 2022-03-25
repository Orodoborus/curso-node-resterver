const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const Usuario = require('../models/user');



const login = async (req, res = response) => {

    const { correo, password } = req.body;

    try{
        //verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if(!usuario)
            return res.status(400).json({message:'Usuario / Password no son correctos - correo'});
        
        //Si el usuario está activo
        if( !usuario.estado )
            return res.status(400).json({message:'Usuario / Password no son correctos - estado: false'});

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword )
            return res.status(400).json({message:'Usuario / Password no son correctos - password'});

        //Generar el jwt
        const token = await generarJWT( usuario.id );

        res.json({
            usuario, 
            token
        })
        
    }catch(e){
        console.log(e)
        return res.status(500).json({ 
            msg: 'Hable con el adminstrador'
        })
    }
}

module.exports = {
    login
}
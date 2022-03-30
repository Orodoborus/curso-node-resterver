const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
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

const googleSignIn = async (req, res = response) =>{
    const { id_token } = req.body;

    try {
        const { correo, nombre, img } = await googleVerify( id_token );
        
        let usuario = await Usuario.findOne({correo});

        if( !usuario ){
            //crear nuevo usuario
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER:ROLE',
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        //Si el usuario en DB estado : false
        if( !usuario.estado )
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            })

        //Generar el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            msg: 'Verificacion de google falló.'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}
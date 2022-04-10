const path = require('path');
const fs = require('fs');

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const validarArchivoSubir = require("../middlewares/validar-archivo");
const { Usuario, Producto } = require('../models');

//sube los archivos al servidor bajo la carpeta uploads
const cargarArchivo = async (req, res = response) => {

    try {
        //Imagenes
        // const nombre = await subirArchivo(req.files, ['txt','md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
    
        res.json({ nombre });
        
    } catch (error) {
        res.status(400).json({ error });
    }
    
}

const actualizarImagen = async (req, res = response) => {
    
    const { id, coleccion } = req.params;

    let modelo;
    
    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo )
                res.status(400).json({ msg: `No existe un usuario con el id ${id}`});
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo )
                res.status(400).json({ msg: `No existe un producto con el id ${id}`});
            break;
        default:
            return res.status(500).json({msg: 'Se me olvió validar esto'})
    }

    //Limpiar imagenes previas
    try {
        if(modelo.img){
            //Hay que borrar la imagen del servidor
            const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImg)){
                fs.unlinkSync(pathImg);
            }
        }
    } catch (error) {
        console.log(error);
    }

    modelo.img = await subirArchivo(req.files, undefined, coleccion);

    await modelo.save();
    
    res.json( modelo );
}

const actualizarImagenCloudinary = async (req, res = response) => {
    
    const { id, coleccion } = req.params;

    let modelo;
    
    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo )
                res.status(400).json({ msg: `No existe un usuario con el id ${id}`});
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo )
                res.status(400).json({ msg: `No existe un producto con el id ${id}`});
            break;
        default:
            return res.status(500).json({msg: 'Se me olvió validar esto'})
    }

    //Limpiar imagenes previas
    try {
        if(modelo.img){
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy(public_id);
        }
    } catch (error) {
        console.log(error);
    }

    const { tempFilePath } = req.files.archivo;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    modelo.img = secure_url;

    await modelo.save();
    
    res.json( modelo );
}

const mostrarImg = async (req, res = response) =>{
    
    const { id, coleccion } = req.params;
    const defaultImgPath = path.join(__dirname, '../assets', 'no-image.jpg');
    
    let modelo;
    
    switch( coleccion ){
        case 'usuarios':
            modelo = await Usuario.findById( id );
            if( !modelo )
                res.sendFile( defaultImgPath );
            break;
        case 'productos':
            modelo = await Producto.findById( id );
            if( !modelo )
                res.sendFile( defaultImgPath );
            break;
        default:
            return res.status(500).json({msg: 'Se me olvió validar esto'})
    }

    //Limpiar imagenes previas
    try {
        if(modelo.img){
            //Hay que borrar la imagen del servidor
            const pathImg = path.join(__dirname, '../uploads', coleccion, modelo.img);
            if(fs.existsSync(pathImg)){
                return res.sendFile( pathImg );
            }
        }
    } catch (error) {
        console.log(error);
    }

    res.sendFile( defaultImgPath );
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImg,
    actualizarImagenCloudinary
}
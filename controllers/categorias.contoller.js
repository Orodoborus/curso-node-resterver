const { response } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { Categoria } = require('../models');

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
    ]);

    res.status(200).json({
        categorias,
        total
    })
}

//obtenerCategoria (by Id) - populate { retorna objeto categoria }
const obtenerCategoriaById = async (req, res = response) => {
    
    const { id } = req.params;

    const categoria = await Categoria.findById( id )
                                .populate('usuario', 'nombre');

    if( !categoria )
        res.status(400).json({ msg: `La categoria no existe` })
    
    res.status(200).json({
        categoria
    })
}

const crearCategoria = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if( categoriaDB ){
        return res.status(400).json({
            msg: `La categoría ${ categoriaDB.nombre }, ya existe`
        })
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuarioAuth._id
    }

    //Crea una nueva categoria con la data
    const categoria = await new Categoria( data );
    
    //Guardar
    await categoria.save();

    res.status(201).json(categoria);
}

//actualizarCategoria
const actualizarCategoria = async ( req, res = response ) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.nombre = req.body.nombre.toUpperCase();
    data.usuario = req.usuarioAuth._id;

    const categoria = await Categoria.findByIdAndUpdate( id, data )
                                        .populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    })
}

//borrarCategoria - estado: false
const borrarCategoria = async (req, res = response) => {
    const { id } = req.params;
    const data = {
        estado: false, 
        usuario: req.usuarioAuth._id 
    }

    const categoria = await Categoria.findByIdAndUpdate( id, data )
                                        .populate('usuario', 'nombre');

    res.status(200).json({
        categoria
    })
}

module.exports = {
    obtenerCategorias,
    obtenerCategoriaById,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}
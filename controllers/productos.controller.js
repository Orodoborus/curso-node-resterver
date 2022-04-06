const { response } = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const { Producto } = require('../models');

//Obtiene todos los productos paginados
const obtenerProductos = async (req, res = response) => {
    const { limite = 5, desde = 0} = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre')
        .populate('categoria','nombre')
    ]);

    res.status(200).json({
        productos,
        total
    })
}

//Obtiene un productoe en específico
const obtenerProductoById = async (req, res= response) => {
    const { id } = req.params;

    const producto = await Producto.findById( id )
                                    .populate('usuario','nombre')
                                    .populate('categoria','nombre');
    
    if( !producto )
        res.status(400).json({
            msg: `El producto con el id: ${ id }, no existe.`
        })

    res.status(200).json( producto );
}

//Crea un nuevo producto
const crearProducto = async (req, res = response) => {
    const nombre = req.body.nombre.toUpperCase();
    const { estado, precio, categoria, descripcion, disponible } = req.body;

    
    const productoEx = await Producto.findOne({ nombre });

    if(productoEx)
        res.status(400).json({
            msg: `El producto: ${nombre}, ya existe`
        });
    
    const data = {
        nombre,
        usuario: req.usuarioAuth._id,
        precio,
        categoria,
        descripcion
    }

    const producto = await new Producto( data );
    
    await producto.save();

    res.status(200).json(producto);
}

//Actualiza un producto
const actualizarProducto = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if(data.nombre)
        data.nombre = req.body.nombre.toUpperCase();
    
    data.usuario = req.usuarioAuth._id;

    const producto = await Producto.findByIdAndUpdate( id, data )
                                    .populate('usuario','nombre')
                                    .populate('categoria','nombre');

    res.status(200).json(producto);
}

//Borra un producto
const borrarProducto = async (req, res = response) => {
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false } )
                            .populate('usuario','nombre')
                            .populate('categoria','nombre');

    res.status(200).json(producto);
}

module.exports = {
    obtenerProductos,
    obtenerProductoById,
    crearProducto,
    actualizarProducto,
    borrarProducto
}
const express = require('express');
const cors = require('cors');

const path = require('./path');
const { dbConnection } = require('../database/config');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        //Conectar a base de datos
        this.conectarDB();

        //Midlewares
        this.middlewares();

        //Rutas de mi aplicacion
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        //CORS
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico
        this.app.use( express.static('public') );
    }

    routes(){
        this.app.use(path.authPath, require('../routes/auth.routes'));
        this.app.use(path.usuariosPath, require('../routes/user.routes'));
        this.app.use(path.categoriasPath, require('../routes/categorias.routes'));
        this.app.use(path.productosPath, require('../routes/productos.routes'));
        this.app.use(path.buscarPath, require('../routes/buscar.routes'));
    }

    listen(){
        this.app.listen(this.port, () =>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}

module.exports = Server;
const { response } = require("express")


const esAdminRole = (req, res = response, next) =>{
    if( !req.usuarioAuth )
        return res.status(500).json({ msg: 'Se quiere verificar el rol sin verificar el token'});

    const { rol, nombre } = req.usuarioAuth;

    if(rol !== 'ADMIN_ROLE')
        return res.status(401).json({msg: 'El nombre no es administrador'})

    next();
}

const tieneRole = ( ...roles ) =>{

    return (req, res = response, next) => {
        if( !req.usuarioAuth )
            return res.status(500).json({ msg: 'Se quiere verificar el rol sin verificar el token'});
        
        if(!roles.includes(req.usuarioAuth.rol))
            res.status(401).json({msg: `El servicio requiere uno de los roles ${ roles }`})
        
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}
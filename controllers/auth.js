const { response } = require('express');

const { generarJWT } = require('../helpers/generar-jwt');
const usersValidates = [
    {
        user: 'user',
        password: 1234
    },
    {
        user: 'admin',
        password: 4321
    },
]

const login = async(req, res = response) => {

    const { user, password } = req.body;

    try {

        // Verificar si el email existe
        const userExisted = usersValidates.filter( item => item.user == user );

        if ( userExisted.length == 0 ) {
            return res.status(400).json({
                msg: 'User / Password is not correct - user'
            });
        }

        // Verificar la contraseña
        if ( userExisted[0].password != password ) {
            return res.status(400).json({
                msg: 'User / Password is not correct - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT( userExisted.user );
        console.log('token', token)

        res.json({
            message: "Success",
            token
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}

module.exports = {
    login
}

const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const { generarJWT } = require('../helpers/jwt');

//req: lo que la persona solicita o envia al backend
//res: es lo que el servidor responde

const crearUsuario = async (req, res = response) => {
   const { email, password } = req.body;

   try {
      let user = await User.findOne({ email });

      if (user) {
         return res.status(400).json({
            ok: false,
            msg: 'a user already exists with that email',
         });
      }

      user = new User(req.body);

      // Encriptar contraseña
      const salt = bcrypt.genSaltSync();
      // El primer argumento es el password que recibimos de la req.body y el segundo es el hash generado por bcrypt
      user.password = bcrypt.hashSync(password, salt);

      await user.save();

      // Generar JWT
      const token = await generarJWT(user.id, user.name);

      res.status(201).json({
         ok: true,
         msg: user.id,
         name: user.name,
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Por favor hable con el administrador',
      });
   }
};

const loginUsuario = async (req, res = response) => {
   const { email, password } = req.body;

   try {
      const user = await User.findOne({ email });

      if (!user) {
         return res.status(400).json({
            ok: false,
            msg: 'The user not exists with that email',
         });
      }

      // Confirmar los passwords
      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
         return res.status(400).json({
            ok: false,
            msg: 'password incorrecto',
         });
      }

      // Generar JWT
      const token = await generarJWT(user.id, user.name);

      res.json({
         ok: true,
         uid: user.id,
         name: user.name,
         token,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Por favor hable con el administrador',
      });
   }
};

const revalidarToken = async (req, res = response) => {
   const { uid, name } = req;

   // generar un nuevo JWT y retornarlo en esta petición
   const token = await generarJWT(uid, name);

   res.json({
      ok: true,
      token,
   });
};

module.exports = {
   crearUsuario,
   loginUsuario,
   revalidarToken,
};

/* 
   Rutas de Usuarios / Auth
   host + /api/auth
*/
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const {
   crearUsuario,
   loginUsuario,
   revalidarToken,
} = require('../controllers/auth');

// crear un usuario
router.post(
   '/new',
   [
      /* middlewares */
      check('name', 'El nombre es obligatorio').not().isEmpty(),
      check('email', 'El email es obligatorio').isEmail(),
      check('password', 'El password debe de ser de 6 caracteres').isLength({
         min: 6,
      }),
      validarCampos,
   ],
   crearUsuario
);

router.post(
   '/',
   [
      /* middlewares */
      check('email', 'El email no es correcto o no esta registrado').isEmail(),
      check('password', 'El password debe de ser de 6 caracteres').isLength({
         min: 6,
      }),
      validarCampos,
   ],
   loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);

module.exports = router;

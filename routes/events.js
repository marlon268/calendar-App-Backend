/* 
   Event Routes
   /api/events
*/

const express = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const router = express.Router();
const {
   getEventos,
   crearEvento,
   actualizarEvento,
   eliminarEvento,
} = require('../controllers/events');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate');

// Todas mis rutas protegidas por JWT
router.use(validarJWT);

// Obtener eventos: read
router.get('/', getEventos);

// Crear un nuevo evento: create
router.post(
   '/',
   [
      check('title', 'El titulo es obligatorio').not().isEmpty(),
      check('start', 'Fecha de inicio es obligatoria').custom(isDate),
      check('end', 'Fecha de finalización es obligatoria').custom(isDate),
      validarCampos,
   ],
   crearEvento
);

// Actualizar evento: update
router.put(
   '/:id',
   [
      check('title', 'El titulo es obligatorio').not().isEmpty(),
      check('start', 'Fecha de inicio es obligatoria').custom(isDate),
      check('end', 'Fecha de finalización es obligatoria').custom(isDate),
      validarCampos,
   ],
   actualizarEvento
);

// Borrar evento: delete
router.delete('/:id', eliminarEvento);

module.exports = router;

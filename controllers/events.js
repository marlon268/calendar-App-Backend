const { response } = require('express');
const Event = require('../models/eventoModel');

const getEventos = async (req, res = response) => {
   const events = await Event.find().populate('user', 'name');

   res.json({
      ok: true,
      events,
   });
};

const crearEvento = async (req, res = response) => {
   const event = new Event(req.body);

   try {
      event.user = req.uid;

      const eventSave = await event.save();
      res.json({
         ok: true,
         event: eventSave,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el  administrador',
      });
   }
};

const actualizarEvento = async (req, res = response) => {
   const eventId = req.params.id;
   const uid = req.uid;

   try {
      const event = await Event.findById(eventId);

      // Verificamos que el evento exista por su Id
      if (!event) {
         return res.status(404).json({
            ok: false,
            msg: 'Evento no existe por ese id',
         });
      }

      // Si el usuario es diferente al uid no debe permitirlse editar el evento de otra persona
      if (event.user.toString() !== uid) {
         return res.status(401).json({
            ok: false,
            msg: 'No tiene los permisos para editar este evento',
         });
      }

      const newEvent = {
         ...req.body,
         user: uid,
      };

      const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
         new: true,
      });
      res.json({
         ok: true,
         event: eventUpdated,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador',
      });
   }
};

const eliminarEvento = async (req, res = response) => {
   const eventId = req.params.id;
   const uid = req.uid;

   try {
      const event = await Event.findById(eventId);

      // Verificamos que el evento exista por su Id
      if (!event) {
         return res.status(404).json({
            ok: false,
            msg: 'Evento no existe por ese id',
         });
      }

      // Si el usuario es diferente al uid no debe permitirlse editar el evento de otra persona
      if (event.user.toString() !== uid) {
         return res.status(401).json({
            ok: false,
            msg: 'No tiene los permisos para eliminar este evento',
         });
      }

      await Event.findByIdAndDelete(eventId);
      res.json({
         ok: true,
      });
   } catch (error) {
      console.log(error);
      res.status(500).json({
         ok: false,
         msg: 'Hable con el administrador',
      });
   }
};

module.exports = {
   getEventos,
   crearEvento,
   actualizarEvento,
   eliminarEvento,
};

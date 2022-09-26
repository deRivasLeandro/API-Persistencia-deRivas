var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  models.profesores
    .findAll({
      attributes: ["id", "nombre"],
      include:[{as: 'materia-que-dicta',
                model: models.materias,
                attributes: ['id', 'nombre', 'id_carrera']}]
    })
    .then(profesores => res.send(profesores))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  models.profesores
    .create({ nombre: req.body.nombre, id_materia: req.body.id_materia  })
    .then(profesores => res.status(201).send({ id: profesores.id, id_materia: profesores.id_materia }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otro profesor con el mismo id')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findProfesor = (id, { onSuccess, onNotFound, onError }) => {
  models.profesores
    .findOne({
      attributes: ["id", "nombre"],
      include:[{as: 'materia-que-dicta',
                model: models.materias,
                attributes: ['id', 'nombre']}],
      where: { id }
    })
    .then(profesores => (profesores ? onSuccess(profesores) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  findProfesor(req.params.id, {
    onSuccess: profesores => res.send(profesores),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  const onSuccess = profesor =>
    profesor
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otro profesor con el mismo id')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  const onSuccess = profesores =>
    profesores
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findProfesor(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
var express = require("express");
var router = express.Router();
var models = require("../models");
var verificacion = require("../verificacion");

router.get("/", verificacion, (req, res) => {
  console.log("Realizando la petición de Get a la Api.")
  const offsetParam = parseInt(req.query.pagina)*10-10;
  models.profesores
    .findAll({
      offset: offsetParam, 
      limit: 10, 
      attributes: ["id", "nombre"],
      include:[{as: 'materia-que-dicta',
                model: models.materias,
                attributes: ['id', 'nombre', 'id_carrera']}]
    })
    .then(profesores => res.send(profesores),
      console.log("Petición realizada con éxito."))
    .catch(() => res.sendStatus(500));
});

router.post("/", verificacion, (req, res) => {
  console.log("Realizando la petición de Post a la Api.")
  models.profesores
    .create({ nombre: req.body.nombre, id_materia: req.body.id_materia  })
    .then(profesores => res.status(201).send({ id: profesores.id, id_materia: profesores.id_materia }),
      console.log("Petición realizada con éxito."))
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
  console.log("Realizando la búsqueda de profesor por ID.")
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

router.get("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Get por ID a la Api.")
  findProfesor(req.params.id, {
    onSuccess: profesores => res.send(profesores),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Put a la Api.")
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

router.delete("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Delete a la Api.")
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
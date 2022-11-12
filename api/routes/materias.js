var express = require("express");
var router = express.Router();
var models = require("../models");
var verificacion = require("../verificacion");

router.get("/", verificacion, (req, res) => {
  console.log("Realizando la petición de Get a la Api.");
  const offsetParam = parseInt(req.query.pagina)*10-10;
  models.materias
    .findAll({
      offset: offsetParam, 
      limit: 10, 
      attributes: ["id", "nombre"],
      include:[{as: 'carrera-a-la-que-pertenece',
                model: models.carrera,
                attributes: ['id', 'nombre']}]
    })
    .then(materias => res.send(materias),
      console.log("Petición realizada con éxito."))
    .catch(() => res.sendStatus(500));
});

router.post("/", verificacion, (req, res) => {
  console.log("Realizando la petición de Post a la Api.");
  models.materias
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera  })
    .then(materias => res.status(201).send({ id: materias.id }),
      console.log("Petición realizada con éxito."))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materia con el mismo id')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findMateria = (id, { onSuccess, onNotFound, onError }) => {
  console.log("Realizando la búsqueda de una materia por ID.");
  models.materias
    .findOne({
      attributes: ["id", "nombre"],
      include:[{as: 'carrera-a-la-que-pertenece',
                model: models.carrera,
                attributes: ['id', 'nombre']}],
      where: { id }
    })
    .then(materias => (materias ? onSuccess(materias) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Get por ID a la Api.");
  findMateria(req.params.id, {
    onSuccess: materias => res.send(materias),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Put a la Api.");
  const onSuccess = materia =>
    materia
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materia con el mismo id')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Delete a la Api.");
  const onSuccess = materias =>
    materias
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findMateria(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });

  router.get("/:id", verificacion, (req, res) => {
    const onSuccess = materia =>
        findPlan(materia.id, {
            onSuccess: planCarrera => res.send(planCarrera),
            onNotFound: () => res.sendStatus(404),
            onError: () => res.sendStatus(500)
            })
    findMateria(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  router.post("/alumno_materia/:id", verificacion, (req, res) => {
    const dni_alumno = req.body.dni_alumno
    models.alumno_materia
      .create({ id_materia: req.params.id, dni_alumno})
      .then(() => res.status(201).send("Relación registrada"))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
  });
});

module.exports = router;
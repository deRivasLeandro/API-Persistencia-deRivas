var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res) => {
  console.log("Realizando la petición de Get a la Api.");
  models.carrera
    .findAll({
      attributes: ["id", "nombre"]
    })
    .then(carreras => res.send(carreras),
      console.log("Petición realizada con éxito."))
    .catch(() => res.sendStatus(500));
});

router.post("/", (req, res) => {
  console.log("Realizando la petición de Post a la Api.");
  models.carrera
    .create({ nombre: req.body.nombre })
    .then(carrera => res.status(201).send({ id: carrera.id }),
      console.log("Petición realizada con éxito."))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        console.log("Error al realizar la petición."),
        res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findCarrera = (id, { onSuccess, onNotFound, onError }) => {
  console.log("Realizando la búsqueda de una carrera por ID.");
  models.carrera
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(carrera => (carrera ? onSuccess(carrera) : onNotFound(),
      console.log("Petición realizada con éxito.")))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
  console.log("Realizando la petición de Get por ID a la Api.");
  findCarrera(req.params.id, {
    onSuccess: carrera => res.send(carrera),    
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
  console.log("Realizando la petición de Put a la Api.");
  const onSuccess = carrera =>
    carrera
      .update({ nombre: req.body.nombre }, { fields: ["nombre"] })
      .then(() => res.sendStatus(200),
      console.log("Petición realizada con éxito."))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra carrera con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
  console.log("Realizando la petición de Delete a la Api.");
  const onSuccess = carrera =>
    carrera
      .destroy()
      .then(() => res.sendStatus(200),
      console.log("Petición realizada con éxito."))
      .catch(() => res.sendStatus(500));
  findCarrera(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;

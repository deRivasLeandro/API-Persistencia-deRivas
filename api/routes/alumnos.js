var express = require("express");
var router = express.Router();
var models = require("../models");
var verificacion = require("../verificacion");

router.get("/", verificacion, (req, res) => {
    console.log("Realizando la petición de Get a la Api.");
    const offsetParam = parseInt(req.query.pagina)*10-10;
    models.alumno
      .findAll({
        offset: offsetParam,
        limit: 10,
        attributes: ["dni", "nombre", "apellido"]
      })
      .then(materias => res.send(materias),
        console.log("Petición realizada con éxito."))
      .catch(() => res.sendStatus(500));
  });

router.post("/", verificacion, (req, res) => {
    console.log("Realizando la petición de Post a la Api.");
    models.alumno
      .create({ dni: req.body.dni, nombre: req.body.nombre, apellido: req.body.apellido })
      .then(alumno => res.status(201).send({ dni: alumno.dni, nombre: alumno.nombre, apellido: alumno.apellido }),
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

const findAlumno = (dni, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["dni", "nombre", "apellido"],
      where: { dni }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:dni", (req, res) => {
  findAlumno(req.params.dni, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});
router.get("/materias/:dni", (req, res) => {
  const onSuccess = alumno => 
    materiasQueCursa(alumno.dni, {
        onSuccess: materia => res.send(materia),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
        })
  findAlumno(req.params.dni, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

const materiasQueCursa = (dni_alumno, { onSuccess, onNotFound, onError }) => {
  models.alumno_materia
    .findAll({
      attributes: ["materias-cursando"],
      include:[ {as:'Materia-Relacionada',
                model:models.materia,
                attributes: ["id","nombre"]}
              ],
      where:  {dni_alumno}
    })
    .then(not=> (not ? onSuccess(not): onNotFound()))
    .catch(() => onError());
};

router.get("/carreras/:dni", (req, res) => {
    const onSuccess = alumno => 
      carrerasQueCursa(alumno.dni, {
          onSuccess: materia => res.send(materia),
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
          })
    findAlumno(req.params.dni, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  const carrerasQueCursa = (dni_alumno, { onSuccess, onNotFound, onError }) => {
    models.alumno_carrera
      .findAll({
        attributes: ["carreras-cursando"],
        include:[ {as:'Carrera-Relacionada',
                  model:models.alumno_carrera,
                  attributes: ["id","nombre"]}
                ],
        where:  {dni_alumno}
      })
      .then(not=> (not ? onSuccess(not): onNotFound()))
      .catch(() => onError());
  };

router.put("/:dni", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .update({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido,
      },
        { fields: ["dni", "nombre", "apellido"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });

      /*router.put("/:dni", (req, res) => {
        console.log("Realizando la petición de Put a la Api.");
        const onSuccess = alumno =>
          alumno
            .update({ dni: req.params.dni, nombre: req.body.nombre, apellido: req.body.apellido }, { fields: ["dni", "nombre", "apellido"] })
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
        findAlumno(req.params.dni, {
        onSuccess,
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
    });*/
});
router.delete("/:dni", (req, res) => {
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findAlumno(req.params.dni, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;
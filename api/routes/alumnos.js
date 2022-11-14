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
        attributes: ["id", "dni", "nombre", "apellido"],
        include:[{as: 'materias-cursando',
                model: models.alumno_materia,
                attributes: ['id'],
                include:[{as: 'materia-cursada',
                          model: models.materias,
                          attributes: ['id', 'nombre']
                        }],
                },
                {as: 'carreras-que-cursa',
                model: models.alumno_carreras,
                attributes: ['id'],
                include:[{as: 'carrera-cursada',
                          model: models.carrera,
                          attributes: ['id', 'nombre']
                        }],
                }],
      })
      .then(alumnos => res.send(alumnos),
        console.log("Petición realizada con éxito."))
      .catch(() => res.sendStatus(500));
  });

router.post("/", verificacion, (req, res) => {
    console.log("Realizando la petición de Post a la Api.");
    models.alumno
      .create({ dni: req.body.dni, nombre: req.body.nombre, apellido: req.body.apellido })
      .then(alumno => res.status(201).send({ id: alumno.id, dni: alumno.dni, nombre: alumno.nombre, apellido: alumno.apellido }),
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

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  console.log("Realizando la búsqueda de alumno por ID.")
  models.alumno
    .findOne({
      attributes: ["id", "dni", "nombre", "apellido"],
      include:[{as: 'materias-cursando',
                model: models.alumno_materia,
                attributes: ['id'],
                include:[{as: 'materia-cursada',
                          model: models.materias,
                          attributes: ['id', 'nombre']
                        }]
                },
                {as: 'carreras-que-cursa',
                model: models.alumno_carreras,
                attributes: ['id'],
                include:[{as: 'carrera-cursada',
                          model: models.carrera,
                          attributes: ['id', 'nombre']
                        }],
              }],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Get por ID a la Api.")
  findAlumno(req.params.id, {
    onSuccess: alumno => res.send(alumno),
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

/*
router.get("/carreras/:id", verificacion, (req, res) => {
    const onSuccess = alumno => 
      carrerasQueCursa(alumno.id, {
          onSuccess: materia => res.send(materia),
          onNotFound: () => res.sendStatus(404),
          onError: () => res.sendStatus(500)
          })
    findAlumno(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
  });
  
  const carrerasQueCursa = (id_alumno, { onSuccess, onNotFound, onError }) => {
    models.alumno_carrera
      .findAll({
        attributes: ["carreras-cursando"],
        include:[ {as:'Carrera-Relacionada',
                  model:models.alumno_carrera,
                  attributes: ["id","nombre"]}
                ],
        where:  {id_alumno}
      })
      .then(not=> (not ? onSuccess(not): onNotFound()))
      .catch(() => onError());
  };
*/

/*
router.put("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Put a la Api.");
  const onSuccess = alumno =>
    alumno
      .update({
        dni: req.body.dni,
        nombre: req.body.nombre,
        apellido: req.body.apellido
      },
        { fields: ["dni", "nombre", "apellido"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otrO alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        };
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
    });
  });
  */

  router.put("/:id", verificacion, (req, res) => {
    console.log("Realizando la petición de Put a la Api.");
    const onSuccess = alumno =>
      alumno
        .update({ dni: req.body.dni, nombre: req.body.nombre, apellido: req.body.apellido, id_carrera: req.body.id_carrera, id_materia: req.body.id_materia }, { fields: ["dni", "nombre", "apellido", "id_carrera", "id_materia"] })
        .then(() => res.sendStatus(200),
        console.log("Petición realizada con éxito."))
        .catch(error => {
          if (error == "SequelizeUniqueConstraintError: Validation error") {
            res.status(400).send('Bad request: existe otro alumno con el mismo nombre')
          }
          else {
            console.log(`Error al intentar actualizar la base de datos: ${error}`)
            res.sendStatus(500)
          }
        });
      findAlumno(req.params.id, {
      onSuccess,
      onNotFound: () => res.sendStatus(404),
      onError: () => res.sendStatus(500)
    });
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
    });
});*/

router.delete("/:id", verificacion, (req, res) => {
  console.log("Realizando la petición de Delete a la Api.")
  const onSuccess = alumno =>
    alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.post("/inscripciones/:id", verificacion, (req, res) => {
  console.log('Realizando inscripción del alumno');
  models.alumno_materia
      .create({ id_alumno: req.params.id, id_materia: req.body.id_materia })
      .then(alumno_materia => res.status(201).send({ id_alumno: alumno_materia.id_alumno, id_materia: alumno_materia.id_materia }),
        console.log("Petición realizada con éxito."))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra inscripción con el mismo id')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
});

router.post("/carrera/:id", verificacion, (req, res) => {
  console.log('Realizando inscripción a carrera del alumno');
  models.alumno_carreras
      .create({ id_alumno: req.params.id, id_carrera: req.body.id_carrera })
      .then(alumno_carreras => res.status(201).send({ id_alumno: alumno_carreras.id_alumno, id_carrera: alumno_carreras.id_carrera }),
        console.log("Petición realizada con éxito."))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra inscripción a carrera con el mismo id')
        }
        else {
          console.log(`Error al intentar insertar en la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
});


/*
router.get("/materias/:id", verificacion, (req, res) => {
  const onSuccess = alumno => 
    materiasQueCursa(alumno.id, {
        onSuccess: alumno_materia => res.send(alumno_materia),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
        })
  findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

const materiasQueCursa = (id_alumno, { onSuccess, onNotFound, onError }) => {
  models.alumno_materia
    .findAll({
      attributes: ['id_materia'],
      include:[ {as:'Materia-Relacionada',
                model:models.materia,
                attributes: ["id","nombre"]}
              ],
      where:  {id_materia}
    })
    .then(not=> (not ? onSuccess(not): onNotFound()))
    .catch(() => onError());
};
*/

module.exports = router;
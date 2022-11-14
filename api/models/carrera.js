'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class carrera extends Model {    
     static associate(models) {
      this.hasMany(models.alumno_carreras
      ,{
        as : 'alumnos-en-carrera',
        foreignKey: 'id_carrera' 
      })
      carrera.hasMany(models.materias, 
        {
          as:'materias',
          foreignKey: 'id_carrera'
        })
    }
  }
  carrera.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'carrera',
  });
  return carrera;
};
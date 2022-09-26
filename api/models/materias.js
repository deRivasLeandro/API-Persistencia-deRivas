'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class materias extends Model {
    static associate(models) {}
  }
  materias.init({
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'materias',
  });

  materias.associate = function(models) {
    materias.belongsTo(models.carrera,
        {
            as:'carrera-a-la-que-pertenece',
            foreignKey: 'id_carrera'
        } )
    };

  return materias;
};
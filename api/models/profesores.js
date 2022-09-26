'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profesores extends Model {
    static associate(models) {}
  }
  profesores.init({
    nombre: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profesores',
  });

  profesores.associate = function(models) {
    profesores.belongsTo(models.materias,
        {
            as:'materia-que-dicta',
            foreignKey: 'id_materia'
        } )
    };

  return profesores;
};
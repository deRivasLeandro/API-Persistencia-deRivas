'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profesores extends Model {
    static associate(models) {}
  }
  profesores.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'profesores',
  });

  profesores.associate = function(models) {
    profesores.belongsTo(models.materias,
        {
            as:'id_materia',
            foreignKey: 'id'
        } )
    }

  return profesores;
};
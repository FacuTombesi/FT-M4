const { DataTypes } = require('sequelize');

module.exports = sequelize => {
  sequelize.define('Ability', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "name_manacost" // Hace que la combinación de las propiedades que tengan esta key sean iguales
    },
    description: {
      type: DataTypes.TEXT
    },
    mana_cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
      unique: "name_manacost",
      validate: {
        min: 10.0,
        max: 250.0
      }
    },
    summary: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = this.getDataValue("name")
        const mana_cost = parseInt(this.getDataValue("mana_cost"))
        const description = this.getDataValue("description")
        return `${name} (${mana_cost} points of mana) - Description: ${description}`
      }
    }
  })
}
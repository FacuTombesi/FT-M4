const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Character', {
    code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      primaryKey: true,
      isNotEqualTo(value) {
        if (value.toUpperCase() === "HENRY") {
          throw Error("Invalid")
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notIn: [["Henry", "SoyHenry", "Soy Henry"]]
      }
    },
    age: {
      type: DataTypes.INTEGER,
      get() {
        const raw = this.getDataValue("age")
        return raw ? `${raw}` : null
      }
    },
    race: {
      type: DataTypes.ENUM(
        "Human",
        "Elf",
        "Machine",
        "Demon",
        "Animal",
        "Other"
        ),
      defaultValue: "Other"
    },
    hp: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    mana: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    date_added: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false
  })
}
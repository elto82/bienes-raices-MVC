import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const Usuario = db.define(
  "usuarios",
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: DataTypes.STRING,
    confirmado: DataTypes.BOOLEAN,
  },
  {
    hooks: {
      beforeCreate: async function (usuario) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
        usuario.confirmado = false;
      },
    },
    scopes: {
      eliminarPassword: {
        attributes: {
          exclude: [
            "password",
            "confirmado",
            "token",
            "createdAt",
            "updatedAt",
          ],
        },
      },
    },
  }
);

//metodos personalizados de sequelize
//me permite verificar la password de un usuario

Usuario.prototype.verificarPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

export default Usuario;

import bcrypt from "bcrypt";
const usuarios = [
  {
    nombre: "Elto",
    email: "elto@elto.com",
    confirmado: 1,
    password: bcrypt.hashSync("123456", 10),
  },
];

export default usuarios;

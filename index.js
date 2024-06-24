import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

const app = express();

//habilitar datos de formularios
app.use(express.urlencoded({ extended: true }));
const port = 3000;

//conexion a base de datos
try {
  await db.authenticate();
  db.sync();
  console.log("Base de datos conectada");
} catch (error) {
  console.log(`Error al conectar la base de datos ${error}`);
}

//habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

//carpeta publica
app.use(express.static("public"));

//router
app.use("/auth", usuarioRoutes);

app.listen(port, () => {
  console.log(`Server is running on localhost://${port}`);
});

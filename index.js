import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

const app = express();

//habilitar datos de formularios
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3000;

//conexion a base de datos
const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync(); // Asegúrate de que las tablas se crean aquí
    console.log("Base de datos conectada");

    // Iniciar el servidor después de sincronizar la base de datos
    app.listen(port, () => {
      console.log(`Server is running on localhost://${port}`);
    });
  } catch (error) {
    console.log(`Error al conectar la base de datos: ${error}`);
  }
};

// Habilitar pug
app.set("view engine", "pug");
app.set("views", "./views");

// Carpeta pública
app.use(express.static("public"));

// Router
app.use("/auth", usuarioRoutes);

// Iniciar el servidor
startServer();

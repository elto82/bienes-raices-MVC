import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

const port = process.env.PORT || 3000;

//crear la app
const app = express();

// Habilitar datos de formularios
app.use(express.urlencoded({ extended: true }));

// Habilitar cookie parser
app.use(cookieParser());

// Habilitar CSRF
app.use(csrf({ cookie: true }));

// Conexión a la base de datos
const startServer = async () => {
  try {
    await db.authenticate();
    await db.sync();
    console.log("Base de datos conectada");

    // Iniciar el servidor después de sincronizar la base de datos
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
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

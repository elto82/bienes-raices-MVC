import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

const app = express();

const port = 3000;

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

import express from "express";
import cors from "cors";
import morgan from "morgan";
import usuarioRoutes from "./routes/usuario.routes";
import clienteRoutes from "./routes/cliente.routes";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Sistema de Reparación — API funcionando correctamente 🚀");
});

// Inicio de rutas
app.use("/api/usuario", usuarioRoutes);
app.use("/clientes", clienteRoutes);

export default app;
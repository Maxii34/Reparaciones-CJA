import express from "express";
import cors from "cors";
import morgan from "morgan";
import usuarioRoutes from "./routes/usuario.routes";
import clienteRoutes from "./routes/cliente.routes";
import equipoRoutes from "./routes/equipo.routes";
import ordenReparacionRoutes from "./routes/ordenReparacion.routes";
import historialEstadoOrdenRoutes from "./routes/historialEstadoOrden.routes";
import repuestoRoutes from "./routes/repuesto.routes";
import pagoRoutes from "./routes/pago.routes";
import repuestoUsadoRoutes from "./routes/repuestoUsado.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Sistema de Reparación — API funcionando correctamente 🚀");
});

// Inicio de rutas
app.use("/api/usuario", usuarioRoutes);
app.use("/api/cliente", clienteRoutes);
app.use("/api/equipo", equipoRoutes);
app.use("/api/orden-reparacion", ordenReparacionRoutes);
app.use("/api/historial-estado-orden", historialEstadoOrdenRoutes);
app.use("/api/repuesto", repuestoRoutes);
app.use("/api/pago", pagoRoutes);
app.use("/api/repuesto-usado", repuestoUsadoRoutes);

// Handler global de errores (siempre último)
app.use(errorHandler);

export default app;
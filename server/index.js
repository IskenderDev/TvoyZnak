import express from "express";
import cors from "cors";
import carNumberLotsRouter from "./routes/carNumberLots.js";
import authRouter from "./routes/auth.js";
import { seedInitialData } from "./storage.js";

seedInitialData();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/car-number-lots", carNumberLotsRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Маршрут не найден" });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err?.status ?? 500).json({ message: err?.message ?? "Внутренняя ошибка сервера" });
});

const port = Number(process.env.PORT ?? 8081);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
}

export default app;

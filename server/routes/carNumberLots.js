import { Router } from "express";
import {
  listCarNumberLots,
  findCarNumberLotById,
  createCarNumberLot,
  createAndRegisterLot,
  deleteCarNumberLot,
} from "../storage.js";
import { parseCreateLotPayload, parseCreateAndRegisterPayload, parsePagination } from "../validation.js";

const router = Router();

const applySorting = (items, sort) => {
  if (!sort) {
    return items;
  }

  const [field, direction] = sort.split(",");
  const dir = direction === "desc" ? -1 : 1;

  if (field === "price") {
    return [...items].sort((a, b) => (Number(a.price) - Number(b.price)) * dir);
  }
  if (field === "date" || field === "createdAt") {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.createdAt ?? a.createdDate ?? a.date ?? 0).getTime();
      const dateB = new Date(b.createdAt ?? b.createdDate ?? b.date ?? 0).getTime();
      return (dateA - dateB) * dir;
    });
  }

  return items;
};

router.get("/", (req, res) => {
  const { page, size, sort } = parsePagination(req.query);
  const items = applySorting(listCarNumberLots(), sort);

  const start = (page - 1) * size;
  const paginated = items.slice(start, start + size);

  res.json(paginated);
});

router.get("/:id", (req, res) => {
  const item = findCarNumberLotById(req.params.id);
  if (!item) {
    res.status(404).json({ message: "Номер не найден" });
    return;
  }
  res.json(item);
});

router.post("/", (req, res) => {
  try {
    const payload = parseCreateLotPayload(req.body);
    const lot = createCarNumberLot(payload);
    res.status(201).json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message ?? "Не удалось создать объявление" });
  }
});

router.post("/create-and-register", (req, res) => {
  try {
    const payload = parseCreateAndRegisterPayload(req.body);
    const { lot } = createAndRegisterLot(payload);
    res.status(201).json(lot);
  } catch (error) {
    res.status(400).json({ message: error.message ?? "Не удалось зарегистрировать объявление" });
  }
});

router.delete("/:id", (req, res) => {
  const removed = deleteCarNumberLot(req.params.id);
  if (!removed) {
    res.status(404).json({ message: "Номер не найден" });
    return;
  }
  res.status(204).send();
});

export default router;

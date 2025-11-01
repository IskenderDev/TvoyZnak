import apiClient from "@/shared/api/client";
import type { CarNumberLot, CarNumberPlate } from "@/entities/car-number-lot/types";

export interface CarNumberLotsListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface CarNumberLotsApi {
  list(params?: CarNumberLotsListParams): Promise<CarNumberLot[]>;
  listMy(): Promise<CarNumberLot[]>;
  get(id: string): Promise<CarNumberLot>;
  create(payload: CreateCarNumberLotPayload): Promise<CarNumberLot>;
  createAndRegister(payload: CreateCarNumberLotAndRegisterPayload): Promise<CarNumberLot>;
  update(id: string, payload: UpdateCarNumberLotPayload): Promise<CarNumberLot>;
  delete(id: string): Promise<void>;
}

export interface CreateCarNumberLotPayload {
  series: string;
  regionCode: string;
  price: number;
  sellerName: string;
  phone?: string;
  description?: string;
  email?: string;
  password?: string;
}

export interface CreateCarNumberLotAndRegisterPayload {
  price: number;
  firstLetter: string;
  secondLetter: string;
  thirdLetter: string;
  firstDigit: string | number;
  secondDigit: string | number;
  thirdDigit: string | number;
  comment?: string;
  regionId: string | number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
}

export interface UpdateCarNumberLotPayload {
  price?: number;
  description?: string;
  phone?: string;
  sellerName?: string;
  status?: string;
}

type UnknownRecord = Record<string, unknown>;

interface RawCarNumberLot extends UnknownRecord {
  id: string | number;
  price?: unknown;
  status?: unknown;
  state?: unknown;
  seller?: unknown;
  sellerName?: unknown;
  fullName?: unknown;
  ownerName?: unknown;
  owner?: UnknownRecord | null;
  user?: unknown;
  phone?: unknown;
  phoneNumber?: unknown;
  description?: unknown;
  comment?: unknown;
  fullCarNumber?: unknown;
  series?: unknown;
  number?: unknown;
  region?: unknown;
  regionCode?: unknown;
  createdAt?: unknown;
  createdDate?: unknown;
  created?: unknown;
  updatedAt?: unknown;
  date?: unknown;
  firstLetter?: unknown;
  secondLetter?: unknown;
  thirdLetter?: unknown;
  firstDigit?: unknown;
  secondDigit?: unknown;
  thirdDigit?: unknown;
  carNumber?: UnknownRecord;
  plate?: UnknownRecord;
  numberInfo?: UnknownRecord;
}

const arrayLikeKeys = ["content", "items", "data", "results", "rows"] as const;

const carNumberLotsApi: CarNumberLotsApi = {
  async list(params) {
    const response = await apiClient.get("/api/car-number-lots", { params });
    const lots = extractList(response.data);
    return lots.map(toCarNumberLot);
  },

  async listMy() {
    const response = await apiClient.get("/api/car-number-lots/my");
    const lots = extractList(response.data);
    return lots.map(toCarNumberLot);
  },

  async get(id) {
    const response = await apiClient.get(`/api/car-number-lots/${id}`);
    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Не удалось получить информацию о номере");
    }
    return lot;
  },

  async create(payload) {
    const response = await apiClient.post("/api/car-number-lots", {
      price: payload.price,
      sellerName: payload.sellerName,
      phone: payload.phone,
      description: payload.description,
      carNumber: {
        series: payload.series,
        regionCode: payload.regionCode,
      },
      email: payload.email,
      password: payload.password,
    });

    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Неверный ответ сервера при создании объявления");
    }
    return lot;
  },

  async createAndRegister(payload) {
    const response = await apiClient.post("/api/car-number-lots/create-and-register", {
      price: payload.price,
      firstLetter: payload.firstLetter,
      secondLetter: payload.secondLetter,
      thirdLetter: payload.thirdLetter,
      firstDigit: payload.firstDigit,
      secondDigit: payload.secondDigit,
      thirdDigit: payload.thirdDigit,
      comment: payload.comment,
      regionId: payload.regionId,
      fullName: payload.fullName,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      password: payload.password,
    });

    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Неверный ответ сервера при регистрации объявления");
    }
    return lot;
  },

  async update(id, payload) {
    const response = await apiClient.put(`/api/car-number-lots/${id}`, {
      price: payload.price,
      description: payload.description,
      phone: payload.phone,
      sellerName: payload.sellerName,
      status: payload.status,
    });

    const lot = mapCarNumberLot(response.data);
    if (!lot) {
      throw new Error("Неверный ответ сервера при обновлении объявления");
    }
    return lot;
  },

  async delete(id) {
    await apiClient.delete(`/api/car-number-lots/${id}`);
  },
};

const extractList = (payload: unknown): RawCarNumberLot[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRawLot);
  }

  if (payload && typeof payload === "object") {
    for (const key of arrayLikeKeys) {
      const nested = (payload as UnknownRecord)[key];
      if (Array.isArray(nested)) {
        return nested.filter(isRawLot);
      }
    }
  }

  return [];
};

const extractSingle = (payload: unknown): RawCarNumberLot | null => {
  if (isRawLot(payload)) {
    return payload;
  }

  if (payload && typeof payload === "object") {
    for (const key of ["data", "result", "item", "lot"]) {
      const nested = (payload as UnknownRecord)[key];
      if (isRawLot(nested)) {
        return nested;
      }
    }

    for (const key of arrayLikeKeys) {
      const nested = (payload as UnknownRecord)[key];
      if (Array.isArray(nested)) {
        const lot = nested.find(isRawLot);
        if (lot) {
          return lot;
        }
      }
    }
  }

  return null;
};

const isRawLot = (value: unknown): value is RawCarNumberLot => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const id = (value as UnknownRecord).id;
  return typeof id === "string" || typeof id === "number";
};

const toCarNumberLot = (dto: RawCarNumberLot): CarNumberLot => {
  const plateSource = mergePlateSources(dto);

  const fullNumber = pickString([
    dto.fullCarNumber,
    plateSource.fullCarNumber,
    plateSource.series,
    plateSource.number,
  ]);

  const lettersFromNumber = extractLetters(fullNumber);
  const digitsFromNumber = extractDigits(fullNumber);

  const letters = [
    ensureLetter(pickString([dto.firstLetter, plateSource.firstLetter, lettersFromNumber[0]])),
    ensureLetter(pickString([dto.secondLetter, plateSource.secondLetter, lettersFromNumber[1]])),
    ensureLetter(pickString([dto.thirdLetter, plateSource.thirdLetter, lettersFromNumber[2]])),
  ];

  const digits = [
    ensureDigit(pickString([dto.firstDigit, plateSource.firstDigit, digitsFromNumber[0]])),
    ensureDigit(pickString([dto.secondDigit, plateSource.secondDigit, digitsFromNumber[1]])),
    ensureDigit(pickString([dto.thirdDigit, plateSource.thirdDigit, digitsFromNumber[2]])),
  ];

  const regionCode = pickString([
    dto.regionCode,
    plateSource.regionCode,
    dto.region,
    plateSource.region,
  ]);

  const plate: CarNumberPlate = {
    firstLetter: letters[0],
    secondLetter: letters[1],
    thirdLetter: letters[2],
    firstDigit: digits[0],
    secondDigit: digits[1],
    thirdDigit: digits[2],
    regionId: toNumber(regionCode, 0),
    comment: pickString([dto.comment, plateSource.comment]) || undefined,
    fullCarNumber: fullNumber || undefined,
  };

  const series =
    pickString([dto.series, plateSource.series, fullNumber]) ||
    buildSeries(letters, digits);

  const digitsString = digits.join("");
  const lettersString = letters.join("");

  const sellerLoginRaw = pickString([dto.user, dto.seller]);
  const sellerNameRaw = pickString([
    dto.sellerName,
    dto.fullName,
    dto.ownerName,
    dto.owner && (dto.owner as UnknownRecord).name,
  ]);

  const sellerLogin = sellerLoginRaw || undefined;
  const sellerName = sellerNameRaw || undefined;
  const sellerDisplay = sellerName || sellerLogin || "Продавец";

  return {
    id: String(dto.id),
    series,
    region: regionCode || "",
    price: toNumber(dto.price, 0),
    seller: sellerDisplay,
    sellerName: sellerName || undefined,
    sellerLogin,
    sellerInfo: {
      id:
        typeof dto.user === "object" && dto.user !== null && "id" in (dto.user as UnknownRecord)
          ? String((dto.user as UnknownRecord).id as string | number)
          : undefined,
      name: sellerDisplay,
      email:
        typeof dto.user === "object" && dto.user !== null && "email" in (dto.user as UnknownRecord)
          ? pickString([(dto.user as UnknownRecord).email]) || undefined
          : pickString([dto.email]) || undefined,
      phoneNumber: pickString([dto.phone, dto.phoneNumber]) || undefined,
    },
    status: pickString([dto.status, dto.state]) || "available",
    category: resolveCategory(series, digitsString, lettersString),
    createdAt: normalizeDate(
      pickString([dto.createdAt, dto.createdDate, dto.created, dto.date]),
    ),
    updatedAt: normalizeDate(pickString([dto.updatedAt, dto.date, dto.createdAt])),
    description: pickString([dto.description]) || undefined,
    phone: pickString([dto.phone, dto.phoneNumber]) || undefined,
    plate,
  };
};

const mergePlateSources = (dto: RawCarNumberLot): UnknownRecord => {
  const sources = [dto.carNumber, dto.plate, dto.numberInfo, dto.number];
  return sources.reduce<UnknownRecord>((acc, source) => {
    if (source && typeof source === "object") {
      return { ...acc, ...source };
    }
    return acc;
  }, {});
};

const pickString = (values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
  }
  return "";
};

const ensureLetter = (value: string): string => {
  if (value) {
    return value.slice(0, 1).toUpperCase();
  }
  return "*";
};

const ensureDigit = (value: string): string => {
  if (!value) {
    return "*";
  }

  const match = value.match(/[0-9]/);
  return match ? match[0] : "*";
};

const extractLetters = (value?: string): [string, string, string] => {
  if (!value) {
    return ["", "", ""];
  }

  const normalized = value.replace(/[^A-Za-zА-Яа-я]/g, "").toUpperCase();
  return [normalized[0] || "", normalized[1] || "", normalized[2] || ""];
};

const extractDigits = (value?: string): [string, string, string] => {
  if (!value) {
    return ["", "", ""];
  }

  const normalized = value.replace(/[^0-9]/g, "");
  return [normalized[0] || "", normalized[1] || "", normalized[2] || ""];
};

const buildSeries = (letters: string[], digits: string[]): string => {
  return [letters[0], digits[0], digits[1], digits[2], letters[1], letters[2]]
    .map((char) => (char === "*" ? "" : char))
    .join("");
};

const toNumber = (value: unknown, fallback: number): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const cleaned = value.replace(/[^0-9.,-]/g, "").replace(/,/g, ".");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
};

const normalizeDate = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date.toISOString();
};

const resolveCategory = (series: string, digits: string, letters: string): string => {
  const normalizedDigits = digits.replace(/\*/g, "");
  const normalizedLetters = letters.replace(/\*/g, "");

  if (normalizedDigits.length === 3 && new Set(normalizedDigits).size === 1) {
    if (["000", "111", "777", "888", "999"].includes(normalizedDigits)) {
      return "vip";
    }
    return "same-digits";
  }

  if (normalizedLetters.length === 3 && new Set(normalizedLetters).size === 1) {
    return "same-letters";
  }

  if (normalizedDigits.length === 3 && normalizedDigits[0] === normalizedDigits[2]) {
    return "mirror";
  }

  if (/^(0{2,}|00[1-9]|007|900|911)$/.test(normalizedDigits)) {
    return "vip";
  }

  if (/777|555|999|123|321/.test(normalizedDigits)) {
    return "vip";
  }

  return series ? "random" : "hidden";
};

function mapCarNumberLotList(payload: unknown): CarNumberLot[] {
  return extractList(payload).map(toCarNumberLot);
}

function mapCarNumberLot(payload: unknown): CarNumberLot | null {
  const raw = extractSingle(payload);
  return raw ? toCarNumberLot(raw) : null;
}

export { carNumberLotsApi, mapCarNumberLotList, mapCarNumberLot };


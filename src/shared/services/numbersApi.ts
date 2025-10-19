import { z } from "zod";
import apiClient from "@/shared/api/client";
import type { NumberItem, PlateInfo } from "@/entities/number/types";

export interface NumbersListParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface NumbersApi {
  list(params?: NumbersListParams): Promise<NumberItem[]>;
  get(id: string): Promise<NumberItem>;
  create(payload: CreateNumberLotPayload): Promise<NumberItem>;
  createAndRegister(payload: CreateAndRegisterPayload): Promise<NumberItem>;
  delete(id: string): Promise<void>;
}

export interface CreateNumberLotPayload {
  series: string;
  regionCode: string;
  price: number;
  sellerName: string;
  phone?: string;
  description?: string;
  email?: string;
  password?: string;
}

export interface CreateAndRegisterPayload {
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

type CarNumberLotDto = z.infer<typeof carNumberLotSchema>;

const carNumberSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    series: z.string().optional(),
    number: z.string().optional(),
    regionCode: z.union([z.string(), z.number()]).optional(),
    region: z.union([z.string(), z.number()]).optional(),
    firstLetter: z.string().optional(),
    secondLetter: z.string().optional(),
    thirdLetter: z.string().optional(),
    firstDigit: z.union([z.string(), z.number()]).optional(),
    secondDigit: z.union([z.string(), z.number()]).optional(),
    thirdDigit: z.union([z.string(), z.number()]).optional(),
    letters: z.array(z.string()).optional(),
    digits: z.union([z.string(), z.array(z.union([z.string(), z.number()]))]).optional(),
  })
  .partial()
  .passthrough();

const carNumberLotSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    price: z.union([z.number(), z.string()]).optional(),
    status: z.string().optional(),
    state: z.string().optional(),
    seller: z.string().optional(),
    sellerName: z.string().optional(),
    owner: z.object({ name: z.string().optional() }).optional(),
    ownerName: z.string().optional(),
    user: z.string().optional(),
    phone: z.string().optional(),
    description: z.string().optional(),
    comment: z.string().optional(),
    createdAt: z.string().optional(),
    createdDate: z.string().optional(),
    created: z.string().optional(),
    updatedAt: z.string().optional(),
    date: z.string().optional(),
    series: z.string().optional(),
    region: z.union([z.string(), z.number()]).optional(),
    regionCode: z.union([z.string(), z.number()]).optional(),
    lot: z.object({}).optional(),
    carNumber: carNumberSchema.optional(),
    plate: carNumberSchema.optional(),
    number: carNumberSchema.optional(),
  })
  .passthrough();

const listResponseSchema = z.array(carNumberLotSchema);

const toNumberItem = (dto: CarNumberLotDto): NumberItem => {
  const carNumber = (dto.carNumber || dto.plate || dto.number || {}) as z.infer<typeof carNumberSchema>;

  const rawSeries = pickString([
    carNumber.series,
    dto.series,
    carNumber.number,
    carNumber.letters ? carNumber.letters.join("") : undefined,
  ]);

  const fromDigits = normalizeDigits(carNumber, rawSeries);
  const fromLetters = normalizeLetters(carNumber, rawSeries);

  const series = buildSeries(fromLetters, fromDigits);

  const regionCode = pickString([
    carNumber.regionCode,
    carNumber.region,
    dto.regionCode,
    dto.region,
  ]);

  const plate: PlateInfo = {
    firstLetter: fromLetters[0],
    secondLetter: fromLetters[1],
    thirdLetter: fromLetters[2],
    firstDigit: fromDigits[0],
    secondDigit: fromDigits[1],
    thirdDigit: fromDigits[2],
    regionId: Number(regionCode || carNumber.id || 0) || 0,
    comment: dto.comment ?? carNumber.comment ?? undefined,
  };

  const digitsString = `${fromDigits[0]}${fromDigits[1]}${fromDigits[2]}`;
  const lettersString = `${fromLetters[0]}${fromLetters[1]}${fromLetters[2]}`;

  const resolvedRegion = regionCode || (plate.regionId ? String(plate.regionId) : "");

  return {
    id: String(dto.id),
    series,
    region: resolvedRegion,
    price: toNumber(dto.price, 0),
    seller:
      pickString([
        dto.seller,
        dto.sellerName,
        dto.owner?.name,
        dto.ownerName,
        dto.user,
      ]) || "Продавец",
    phone: pickString([dto.phone]),
    description: pickString([dto.description]),
    date: normalizeDate(pickString([dto.createdAt, dto.createdDate, dto.created, dto.date, dto.updatedAt])),
    status: pickString([dto.status, dto.state]) || "available",
    category: resolveCategory(series, digitsString, lettersString),
    plate,
  };
};

const normalizeDigits = (
  carNumber: z.infer<typeof carNumberSchema>,
  rawSeries?: string,
): [string, string, string] => {
  const digitsFromSeries = extractDigits(rawSeries);
  const digitsFromArray = Array.isArray(carNumber.digits)
    ? carNumber.digits.map(String)
    : typeof carNumber.digits === "string"
      ? carNumber.digits.split("")
      : [];

  const digits: [string, string, string] = [
    ensureDigit(carNumber.firstDigit),
    ensureDigit(carNumber.secondDigit),
    ensureDigit(carNumber.thirdDigit),
  ];

  digits.forEach((digit, idx) => {
    if (digit !== "*") return;
    digits[idx] = digitsFromArray[idx] ?? digitsFromSeries[idx] ?? "*";
  });

  return digits;
};

const normalizeLetters = (
  carNumber: z.infer<typeof carNumberSchema>,
  rawSeries?: string,
): [string, string, string] => {
  const lettersFromSeries = extractLetters(rawSeries);
  const lettersFromArray = Array.isArray(carNumber.letters)
    ? carNumber.letters.map((item) => (typeof item === "string" ? item : "")).filter(Boolean)
    : [];

  const letters: [string, string, string] = [
    ensureLetter(carNumber.firstLetter),
    ensureLetter(carNumber.secondLetter),
    ensureLetter(carNumber.thirdLetter),
  ];

  letters.forEach((letter, idx) => {
    if (letter !== "*") return;
    letters[idx] = lettersFromArray[idx] ?? lettersFromSeries[idx] ?? "*";
  });

  return letters;
};

const ensureLetter = (value: unknown): string => {
  if (typeof value === "string" && value.trim()) {
    return value.trim().slice(0, 1).toUpperCase();
  }
  return "*";
};

const ensureDigit = (value: unknown): string => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value).slice(0, 1);
  }
  if (typeof value === "string" && value.trim()) {
    const match = value.trim().match(/[0-9]/);
    if (match) {
      return match[0];
    }
  }
  return "*";
};

const extractDigits = (series?: string): string[] => {
  if (!series) return [];
  const cleaned = series.replace(/[^0-9]/g, "");
  return cleaned.slice(0, 3).split("");
};

const extractLetters = (series?: string): string[] => {
  if (!series) return [];
  const cleaned = series.replace(/[^A-Za-zА-Яа-я]/g, "").toUpperCase();
  return cleaned.slice(0, 3).split("");
};

const buildSeries = (letters: [string, string, string], digits: [string, string, string]) => {
  const normalized = [letters[0], ...digits, letters[1], letters[2]].map((char) => (char === "*" ? "" : char));
  return normalized.join("");
};

const pickString = (values: Array<unknown | undefined>): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const normalizeDate = (value?: string): string => {
  if (!value) {
    return new Date().toISOString();
  }
  const date = new Date(value);
  if (Number.isNaN(+date)) {
    return new Date().toISOString();
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

const request = async <T>(
  fn: () => Promise<{ data: unknown }>,
  transform: (payload: unknown) => T,
): Promise<T> => {
  const response = await fn();
  return transform(response.data);
};

const numbersApi: NumbersApi = {
  async list(params) {
    return request(() => apiClient.get("/api/car-number-lots", { params }), (payload) => {
      const parsed = listResponseSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("Failed to parse car-number-lots list", parsed.error);
        return [];
      }
      return parsed.data.map(toNumberItem);
    });
  },

  async get(id) {
    return request(() => apiClient.get(`/api/car-number-lots/${id}`), (payload) => {
      const parsed = carNumberLotSchema.safeParse(payload);
      if (!parsed.success) {
        console.error("Failed to parse car-number-lot", parsed.error);
        throw new Error("Не удалось получить информацию о номере");
      }
      return toNumberItem(parsed.data);
    });
  },

  async create(payload) {
    return request(
      () =>
        apiClient.post("/api/car-number-lots", {
          price: payload.price,
          sellerName: payload.sellerName,
          phone: payload.phone,
          description: payload.description,
          carNumber: {
            series: payload.series,
            regionCode: payload.regionCode,
          },
        }),
      (data) => {
        const parsed = carNumberLotSchema.safeParse(data);
        if (!parsed.success) {
          console.error("Failed to parse car-number-lot after create", parsed.error);
          throw new Error("Неверный ответ сервера при создании объявления");
        }
        return toNumberItem(parsed.data);
      },
    );
  },

  async createAndRegister(payload) {
    return request(
      () =>
        apiClient.post("/api/car-number-lots/create-and-register", {
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
        }),
      (data) => {
        const parsed = carNumberLotSchema.safeParse(data);
        if (!parsed.success) {
          console.error("Failed to parse car-number-lot after register", parsed.error);
          throw new Error("Неверный ответ сервера при регистрации объявления");
        }
        return toNumberItem(parsed.data);
      },
    );
  },

  async delete(id) {
    await apiClient.delete(`/api/car-number-lots/${id}`);
  },
};

export { numbersApi };

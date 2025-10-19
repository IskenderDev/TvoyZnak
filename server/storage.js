import { randomUUID, createHash } from "crypto";

const carNumberLots = [];
const users = [];
let seeded = false;

const defaultStatus = "available";

const normalizeWhitespace = (value) => value.replace(/\s+/g, "");

const sanitizeSeries = (value) => normalizeWhitespace(String(value ?? "")).toLocaleUpperCase("ru-RU");

const normalizeRegionCode = (value) => {
  if (value == null) {
    throw new Error("Укажите код региона");
  }
  const trimmed = String(value).trim();
  if (!trimmed) {
    throw new Error("Укажите код региона");
  }
  const digits = trimmed.match(/\d+/g);
  if (!digits || digits.join("").length === 0) {
    throw new Error("Код региона должен содержать цифры");
  }
  return digits.join("").slice(0, 3);
};

const extractLetters = (series) => {
  const matches = series.match(/[A-Za-zА-Яа-яЁё]/gu) ?? [];
  const letters = matches
    .map((char) => char.toLocaleUpperCase("ru-RU").replace("Ё", "Е"))
    .slice(0, 3);
  if (letters.length !== 3) {
    throw new Error("Серия должна содержать три буквы");
  }
  return letters;
};

const extractDigits = (series) => {
  const matches = series.match(/\d/g) ?? [];
  const digits = matches.slice(0, 3);
  if (digits.length !== 3) {
    throw new Error("Серия должна содержать три цифры");
  }
  return digits;
};

const buildCarNumber = (series, regionCode) => {
  const sanitizedSeries = sanitizeSeries(series);
  const letters = extractLetters(sanitizedSeries);
  const digits = extractDigits(sanitizedSeries);

  return {
    id: randomUUID(),
    series: sanitizedSeries,
    number: digits.join(""),
    regionCode,
    region: regionCode,
    firstLetter: letters[0],
    secondLetter: letters[1],
    thirdLetter: letters[2],
    firstDigit: digits[0],
    secondDigit: digits[1],
    thirdDigit: digits[2],
    letters,
    digits,
  };
};

const hashPassword = (password) => {
  if (!password) {
    return undefined;
  }
  const normalized = String(password);
  return createHash("sha256").update(normalized).digest("hex");
};

const findUserByContact = (email, phoneNumber) => {
  const normalizedEmail = email?.toLowerCase();
  const normalizedPhone = phoneNumber ? normalizeWhitespace(phoneNumber) : undefined;

  return users.find((user) => {
    if (normalizedEmail && user.email && user.email === normalizedEmail) {
      return true;
    }
    if (normalizedPhone && user.phoneNumber && user.phoneNumber === normalizedPhone) {
      return true;
    }
    return false;
  });
};

const upsertUser = ({ fullName, email, phoneNumber, password, source, lotId }) => {
  const now = new Date().toISOString();
  const normalizedEmail = email?.toLowerCase();
  const normalizedPhone = phoneNumber ? normalizeWhitespace(phoneNumber) : undefined;

  let user = findUserByContact(normalizedEmail, normalizedPhone);

  if (user) {
    user.fullName = fullName || user.fullName;
    user.updatedAt = now;
    if (normalizedEmail) {
      user.email = normalizedEmail;
    }
    if (normalizedPhone) {
      user.phoneNumber = normalizedPhone;
    }
    if (password) {
      user.passwordHash = hashPassword(password);
    }
    if (lotId) {
      user.lotIds ??= [];
      if (!user.lotIds.includes(lotId)) {
        user.lotIds.push(lotId);
      }
    }
    return user;
  }

  user = {
    id: randomUUID(),
    fullName,
    email: normalizedEmail,
    phoneNumber: normalizedPhone,
    passwordHash: password ? hashPassword(password) : undefined,
    lotIds: lotId ? [lotId] : [],
    createdAt: now,
    updatedAt: now,
    source: source ?? "manual",
  };

  users.push(user);
  return user;
};

const buildLotFromPayload = ({
  series,
  regionCode,
  price,
  sellerName,
  phone,
  description,
  comment,
  status = defaultStatus,
}) => {
  if (!sellerName || typeof sellerName !== "string" || !sellerName.trim()) {
    throw new Error("Укажите имя продавца");
  }

  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
    throw new Error("Некорректная стоимость");
  }

  const normalizedRegionCode = normalizeRegionCode(regionCode);
  const carNumber = buildCarNumber(series, normalizedRegionCode);
  const now = new Date().toISOString();
  const trimmedPhone = phone && typeof phone === "string" && phone.trim() ? phone.trim() : undefined;
  const trimmedDescription =
    description && typeof description === "string" && description.trim() ? description.trim() : undefined;
  const trimmedComment = comment && typeof comment === "string" && comment.trim() ? comment.trim() : trimmedDescription;

  const seller = sellerName.trim();

  const lot = {
    id: randomUUID(),
    price: numericPrice,
    sellerName: seller,
    seller,
    ownerName: seller,
    owner: { name: seller },
    user: seller,
    phone: trimmedPhone,
    description: trimmedDescription,
    comment: trimmedComment,
    status,
    state: status,
    createdAt: now,
    createdDate: now,
    created: now,
    updatedAt: now,
    date: now,
    series: carNumber.series,
    regionCode: normalizedRegionCode,
    region: normalizedRegionCode,
    carNumber,
    plate: carNumber,
    number: carNumber,
  };

  return lot;
};

const addLot = (lot) => {
  carNumberLots.unshift(lot);
  return lot;
};

const listCarNumberLots = () => carNumberLots.map((item) => ({ ...item }));

const findCarNumberLotById = (id) => carNumberLots.find((item) => item.id === id);

const createCarNumberLot = (payload) => {
  const lot = buildLotFromPayload(payload);
  return addLot(lot);
};

const createAndRegisterLot = (payload) => {
  const lot = createCarNumberLot(payload);
  const user = upsertUser({
    fullName: payload.sellerName,
    email: payload.email,
    phoneNumber: payload.phone,
    password: payload.password,
    source: "car-number-lot",
    lotId: lot.id,
  });

  return { lot, user };
};

const deleteCarNumberLot = (id) => {
  const index = carNumberLots.findIndex((item) => item.id === id);
  if (index === -1) {
    return false;
  }
  carNumberLots.splice(index, 1);
  return true;
};

const registerUser = ({ fullName, email, phoneNumber, password }) => {
  if (!fullName || typeof fullName !== "string" || !fullName.trim()) {
    throw new Error("Укажите имя");
  }
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new Error("Укажите электронную почту");
  }
  if (!phoneNumber || typeof phoneNumber !== "string" || !phoneNumber.trim()) {
    throw new Error("Укажите телефон");
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов");
  }

  return upsertUser({
    fullName: fullName.trim(),
    email: email.trim(),
    phoneNumber: phoneNumber.trim(),
    password,
    source: "auth-register",
  });
};

const seedInitialData = () => {
  if (seeded) {
    return;
  }
  seeded = true;

  const samples = [
    {
      series: "А123ВС",
      regionCode: "77",
      price: 150000,
      sellerName: "Алексей Петров",
      phone: "+7 900 111-22-33",
      description: "Редкий номер, отличное состояние",
    },
    {
      series: "Е777КХ",
      regionCode: "197",
      price: 320000,
      sellerName: "Марина Соколова",
      phone: "+7 905 222-33-44",
      description: "Блатной номер, три семерки",
    },
    {
      series: "О555ОО",
      regionCode: "78",
      price: 500000,
      sellerName: "Иван Иванов",
      phone: "+7 921 555-55-55",
      description: "VIP номер для статуса",
    },
    {
      series: "М900АМ",
      regionCode: "99",
      price: 98000,
      sellerName: "Наталья Орлова",
      phone: "+7 916 123-45-67",
      description: "Красивый зеркальный номер",
    },
    {
      series: "Р123ОР",
      regionCode: "177",
      price: 87000,
      sellerName: "Степан Волков",
      phone: "+7 903 987-65-43",
      description: "Отличный номер для работы",
    },
  ];

  samples.forEach((sample) => {
    createAndRegisterLot(sample);
  });
};

export {
  listCarNumberLots,
  findCarNumberLotById,
  createCarNumberLot,
  createAndRegisterLot,
  deleteCarNumberLot,
  registerUser,
  seedInitialData,
  carNumberLots,
  users,
};

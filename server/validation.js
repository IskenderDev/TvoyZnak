const ensurePayload = (body) => {
  if (!body || typeof body !== "object") {
    throw new Error("Некорректные данные запроса");
  }
  return body;
};

const ensureString = (value, message) => {
  if (typeof value !== "string") {
    throw new Error(message);
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(message);
  }
  return trimmed;
};

const ensurePrice = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    throw new Error("Некорректная стоимость номера");
  }
  return numeric;
};

const ensureDigitChar = (value, message) => {
  const digit = ensureString(String(value ?? ""), message);
  if (!/^\d$/.test(digit)) {
    throw new Error(message);
  }
  return digit;
};

const ensureLetterChar = (value, message) => {
  const letter = ensureString(String(value ?? ""), message)
    .toLocaleUpperCase("ru-RU")
    .replace("Ё", "Е");
  if (!/^[A-ZА-Я]$/.test(letter)) {
    throw new Error(message);
  }
  return letter;
};

const ensureRegionCode = (value) => {
  if (value == null) {
    throw new Error("Укажите регион номера");
  }
  const digits = String(value).match(/\d+/g);
  if (!digits) {
    throw new Error("Укажите регион номера");
  }
  const code = digits.join("");
  if (!code) {
    throw new Error("Укажите регион номера");
  }
  return code.slice(0, 3);
};

const ensurePassword = (value, message) => {
  const password = ensureString(value, message);
  if (password.length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов");
  }
  return password;
};

const parseCreateLotPayload = (body) => {
  const payload = ensurePayload(body);

  const sellerName = ensureString(payload.sellerName, "Укажите имя продавца");

  if (!payload.carNumber || typeof payload.carNumber !== "object") {
    throw new Error("Укажите информацию о номере");
  }

  const series = ensureString(payload.carNumber.series, "Укажите серию номера");
  const regionCode = ensureString(payload.carNumber.regionCode, "Укажите регион номера");

  const numericPrice = ensurePrice(payload.price);

  const phone = typeof payload.phone === "string" && payload.phone.trim() ? payload.phone.trim() : undefined;
  const description =
    typeof payload.description === "string" && payload.description.trim() ? payload.description.trim() : undefined;

  return {
    series,
    regionCode,
    price: numericPrice,
    sellerName,
    phone,
    description,
  };
};

const parseCreateAndRegisterPayload = (body) => {
  const payload = ensurePayload(body);

  const price = ensurePrice(payload.price);
  const firstLetter = ensureLetterChar(payload.firstLetter, "Укажите первую букву номера");
  const secondLetter = ensureLetterChar(payload.secondLetter, "Укажите вторую букву номера");
  const thirdLetter = ensureLetterChar(payload.thirdLetter, "Укажите третью букву номера");

  const firstDigit = ensureDigitChar(payload.firstDigit, "Укажите первую цифру номера");
  const secondDigit = ensureDigitChar(payload.secondDigit, "Укажите вторую цифру номера");
  const thirdDigit = ensureDigitChar(payload.thirdDigit, "Укажите третью цифру номера");

  const regionCode = ensureRegionCode(payload.regionId);

  const fullName = ensureString(payload.fullName, "Укажите имя продавца");
  const phoneNumber = ensureString(payload.phoneNumber, "Укажите телефон");

  const email = typeof payload.email === "string" && payload.email.trim() ? payload.email.trim() : undefined;
  const password = ensurePassword(payload.password, "Укажите пароль");

  const comment = typeof payload.comment === "string" && payload.comment.trim() ? payload.comment.trim() : undefined;

  const series = `${firstLetter}${firstDigit}${secondDigit}${thirdDigit}${secondLetter}${thirdLetter}`;

  return {
    series,
    regionCode,
    price,
    sellerName: fullName,
    phone: phoneNumber,
    description: comment,
    comment,
    email,
    password,
  };
};

const parseRegisterPayload = (body) => {
  const payload = ensurePayload(body);

  const fullName = ensureString(payload.fullName, "Укажите имя");
  const email = ensureString(payload.email, "Укажите почту").toLowerCase();
  const phoneNumber = ensureString(payload.phoneNumber, "Укажите телефон");
  const password = ensureString(payload.password, "Укажите пароль");

  if (password.length < 6) {
    throw new Error("Пароль должен содержать минимум 6 символов");
  }

  return {
    fullName,
    email,
    phoneNumber,
    password,
  };
};

const parsePagination = (query) => {
  const pageRaw = typeof query.page === "string" ? query.page : Array.isArray(query.page) ? query.page[0] : undefined;
  const sizeRaw = typeof query.size === "string" ? query.size : Array.isArray(query.size) ? query.size[0] : undefined;
  const sortRaw = typeof query.sort === "string" ? query.sort : Array.isArray(query.sort) ? query.sort[0] : undefined;

  const page = Number(pageRaw ?? 1);
  const size = Number(sizeRaw ?? 20);

  return {
    page: Number.isFinite(page) && page > 0 ? page : 1,
    size: Number.isFinite(size) && size > 0 ? size : 20,
    sort: sortRaw,
  };
};

export {
  parseCreateLotPayload,
  parseCreateAndRegisterPayload,
  parseRegisterPayload,
  parsePagination,
};

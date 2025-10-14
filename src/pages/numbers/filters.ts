/**
 * Перечень фильтров каталога (без реализации).
 * Использование: только типы/enum, чтобы обозначить возможные варианты.
 */

export enum NumbersFilter {
  SameDigits = "same-digits",         // Одинаковые цифры
  SameLetters = "same-letters",       // Одинаковые буквы
  Mirror = "mirror",                  // Зеркально
  ByRegion = "by-region",             // По регионам
  LeadingZeros = "leading-zeros"      // Первые две цифры — нули
}

// Альтернативно: союз типов
export type NumbersFilterUnion =
  | "same-digits"
  | "same-letters"
  | "mirror"
  | "by-region"
  | "leading-zeros";

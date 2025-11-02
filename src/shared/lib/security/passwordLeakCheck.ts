/**
 * Временная заглушка проверки пароля на утечки.
 * Всегда возвращает `false`, чтобы не блокировать пользователей.
 */
export const isPasswordCompromised = async (_password: string): Promise<boolean> => {
  void _password;
  return false;
};

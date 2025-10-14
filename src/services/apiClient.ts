/**
 * Абстракция клиента API. Без реализации.
 * Можно будет внедрить позже (fetch/axios).
 */

export interface ApiRequestConfig {
  headers?: Record<string, string>;
  signal?: AbortSignal;
  // и т.д.
}

export interface ApiClient {
  get<TResponse>(url: string, config?: ApiRequestConfig): Promise<TResponse>;
  post<TBody, TResponse>(url: string, body: TBody, config?: ApiRequestConfig): Promise<TResponse>;
  put<TBody, TResponse>(url: string, body: TBody, config?: ApiRequestConfig): Promise<TResponse>;
  delete<TResponse>(url: string, config?: ApiRequestConfig): Promise<TResponse>;
}

// Заглушка-тип для будущей реализации:
// export const apiClient: ApiClient = {} as any;

# TvoyZnak Admin Posts

Панель администратора для управления постами: просмотр, создание, обновление и удаление записей с поддержкой изображений и файловой валидации.

## Стек

- React 19 + TypeScript + Vite
- TailwindCSS
- Axios
- @tanstack/react-query
- react-hook-form + zod
- react-hot-toast для уведомлений

## Быстрый старт

1. Установите зависимости:

   ```bash
   npm install
   ```

2. Скопируйте файл окружения и укажите базовый URL API:

   ```bash
   cp .env.example .env
   # при необходимости измените значение VITE_API_URL
   ```

3. Запустите dev-сервер:

   ```bash
   npm run dev
   ```

4. Сборка прод-версии:

   ```bash
   npm run build
   ```

## Админ-страница постов

- Поиск с debounce (400 мс) по заголовку и описанию.
- Сортировка по дате создания (по умолчанию по убыванию).
- Пагинация с отображением счётчика «Показано N из M».
- Просмотр поста в боковом модальном окне и переход к редактированию.
- Создание/редактирование через модальное окно с валидацией (заголовок, описание, изображение, размер ≤ 5 МБ, форматы JPG/PNG/WebP).
- Поддержка трёх режимов работы с изображением при обновлении: оставить без изменений, заменить новым файлом, отправить «пустое значение» для очистки на сервере.
- Удаление с подтверждением и оптимистичным обновлением списка.

## Multipart и очистка изображения

Создание и обновление постов выполняется через `FormData`. Чтобы сбросить изображение на сервере, мы добавляем в форму пустой `Blob` без содержимого:

```ts
form.append("image", new Blob([], { type: "application/octet-stream" }), "");
```

Это гарантирует, что сервер увидит multipart-часть `image` даже без файла и корректно удалит изображение.

## Структура

```
src/
  app/
    queryClient.ts
    router.tsx
  entities/post/
    api.ts
    hooks.ts
    types.ts
  pages/admin/news/
    AdminNewsListPage.tsx
    components/
      PostFormModal.tsx
      PostViewDrawer.tsx
  shared/
    api/http.ts
    lib/debounce.ts
    ui/
      Button.tsx
      ConfirmDialog.tsx
      EmptyState.tsx
      ErrorState.tsx
      FileDropzone.tsx
      IconButton.tsx
      Input.tsx
      Modal.tsx
      Spinner.tsx
      Table.tsx
      Textarea.tsx
```

## Проверка качества

- Линтер: `npm run lint`
- Сборка: `npm run build`

Убедитесь, что указанный API доступен и поддерживает эндпоинты `/api/posts` для корректной работы страницы.

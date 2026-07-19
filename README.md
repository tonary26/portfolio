# DevSpace Portfolio

Одностраничное портфолио на Vue 3 + Vite + GSAP.

## Локальный запуск

```bash
npm install
npm run dev
```

## Production-сборка

```bash
npm run build
```

Готовые статические файлы появятся в `dist/`. Для обычного хостинга загрузите содержимое `dist/` в корень сайта. Серверной части у портфолио нет.

## Деплой

- Vercel: импортируйте папку проекта; команда сборки `npm run build`, output `dist`.
- Nginx: используйте пример `nginx.conf`.
- Apache/shared hosting: `.htaccess` уже лежит в `public/` и попадёт в `dist/`.

Перед публикацией проверьте Telegram и email в секции контактов в `src/App.vue`.

const express = require("express");
const path = require("path");
const newsRoutes = require("./routes/newsRoutes");

// Обрабатываем .env файлы
require("dotenv").config();

// Создаем приложение express
const app = express();

// Добавляем проддержку json для работы с ответами
app.use(express.json());

// Указываем папку со статичными файлами
app.use(express.static(path.join(__dirname, "../public")));

// Привязываем маршруты к /api/news
app.use("/api/news", newsRoutes);

// Экспортируем
module.exports = app;
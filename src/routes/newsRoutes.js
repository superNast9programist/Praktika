const express = require("express");
const { searchNews } = require("../controllers/newsController");

// Создаем router, в нем будут храниться все маршруты
const router = express.Router();

// Вызываем контроллер на главном маршруте
router.get("/", searchNews);

// Экспортируем
module.exports = router;
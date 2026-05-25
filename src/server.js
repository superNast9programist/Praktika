const app = require("./app");

// PORT будет такой же как в env, или 3000
const PORT = process.env.PORT || 3000;

// Запускаем приложение из app.js на выбранном порту
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
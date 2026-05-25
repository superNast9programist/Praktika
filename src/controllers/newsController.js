const { getNews } = require("../services/newsService");

async function searchNews(req, res) {
  try {
    
    // Получаем из запроса q
    // Это то, что пользователь введет в поиск
    const query = req.query.q;

    // Если запроса нет - ошибка
    if (!query) {
      return res.status(400).json({ error: "Query required" });
    }
    
    // Вызываем сервис
    const articles = await getNews(query);
    
    // Прикрепляем к ответу полученные новости
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch news" });
  }
}

// Экспортируем
module.exports = { searchNews };

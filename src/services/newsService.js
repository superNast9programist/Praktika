const axios = require("axios");

async function getNews(query) {
  // Отправляем запрос на newsapi
  const response = await axios.get("https://newsapi.org/v2/everything", {
    
    // Передаем в запрос:
    params: {
      q: query, // Что мы ищем
      apiKey: process.env.NEWS_API_KEY, // api ключ
      pageSize: 10, // Сколько новостей нужно
    },
  });
  
  // Из всего ответа от newsapi нам нужны только articles (новости)
  return response.data.articles;
}

// Экспортируем функцию
// Чтобы ее можно было вызвать из другого файла
module.exports = { getNews };
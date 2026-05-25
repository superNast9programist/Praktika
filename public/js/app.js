// Получаем элементы со страницы
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const newsContainer = document.getElementById("newsContainer");
const savedContainer = document.getElementById("savedContainer");

// Функция для получения сохраненных новостей
function getSavedNews() {
  return JSON.parse(localStorage.getItem("savedNews")) || [];
}

// Функция для сохранения новостей
function saveNews(article) {
  // Получаем сохраненные новости
  const saved = getSavedNews();

  // Добавляем к сохраненным новую новость
  saved.push(article);

  // Сохраняем в local storage
  localStorage.setItem("savedNews", JSON.stringify(saved));

  // Отображаем сохраненные новости
  renderSavedNews();
}

// Отображение сохраненных новостей
function renderSavedNews() {
  // Получаем сохраненные новости
  const saved = getSavedNews();

  // Кладем в saved container новости в виде html
  savedContainer.innerHTML = saved
    .map(
      (article) => `
      <div class="article">
        <h3>${article.title}</h3>
      </div>
    `,
    )
    .join("");
}

// Обработка нажатия на кнопку поиска
searchBtn.addEventListener("click", async () => {
  // Получаем текст из поля ввода
  const query = searchInput.value;

  // Отправляем запрос, получаем ответ
  const res = await fetch(`/api/news?q=${query}`);

  // Из всего ответа нам нужен только json
  const articles = await res.json();

  // Отображаем новости в news container
  newsContainer.innerHTML = articles
    .map(
      (article) => `
      <div class="article">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <button onclick='saveNews(${JSON.stringify(article)})'>Save</button>
      </div>
    `,
    )
    .join("");
});

// Отображаем сохраненные новости
renderSavedNews();
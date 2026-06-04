// Получаем элементы со страницы
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const newsContainer = document.getElementById("newsContainer");
const savedContainer = document.getElementById("savedContainer");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const backBtn = document.getElementById("backBtn");
const forwardBtn = document.getElementById("forwardBtn");
// Функция для получения сохраненных новостей
function getSavedNews() {
  return JSON.parse(localStorage.getItem("savedNews")) || [];
}

// Функция для сохранения новостей
function saveNews(article) {
  const saved = getSavedNews();
  
  // Проверяем, нет ли уже такой новости в сохраненных
  const isDuplicate = saved.some(savedArticle => savedArticle.title === article.title);
  
  if (!isDuplicate) {
    saved.push(article);
    localStorage.setItem("savedNews", JSON.stringify(saved));
    renderSavedNews();
  } else {
    alert("Эта новость уже сохранена!");
  }
}

// Функция для удаления одной новости
function deleteNews(index) {
  const saved = getSavedNews();
  saved.splice(index, 1);
  localStorage.setItem("savedNews", JSON.stringify(saved));
  renderSavedNews();
}

// Функция для удаления всех новостей
function deleteAllNews() {
  if (confirm("Вы уверены, что хотите удалить все сохраненные новости?")) {
    localStorage.setItem("savedNews", JSON.stringify([]));
    renderSavedNews();
  }
}

// Отображение сохраненных новостей
function renderSavedNews() {
  const saved = getSavedNews();
  
  if (saved.length === 0) {
    savedContainer.innerHTML = '<p style="color: #999; text-align: center;">Нет сохраненных новостей</p>';
    return;
  }
  
  savedContainer.innerHTML = saved
    .map(
      (article, index) => `
      <div class="article">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <div class="button-group">
          <button class="delete-btn" onclick="deleteNews(${index})">Delete</button>
        </div>
      </div>
    `,
    )
    .join("");
}

// Обработка нажатия на кнопку поиска
searchBtn.addEventListener("click", async () => {
  const query = searchInput.value.trim();
  
  if (!query) {
    alert("Введите текст для поиска");
    return;
  }
  
  try {
    const res = await fetch(`/api/news?q=${query}`);
    const articles = await res.json();
    
    if (articles.length === 0) {
      newsContainer.innerHTML = '<p style="color: #999; text-align: center;">Новости не найдены</p>';
      return;
    }
    
    newsContainer.innerHTML = articles
      .map(
        (article) => `
        <div class="article">
          <h3>${article.title}</h3>
          <p>${article.description || ""}</p>
          <button class="save-btn" onclick='saveNews(${JSON.stringify(article).replace(/'/g, "&#39;")})'>Save</button>
        </div>
      `,
      )
      .join("");
  } catch (error) {
    console.error("Ошибка при поиске:", error);
    newsContainer.innerHTML = '<p style="color: #c48b8b; text-align: center;">Ошибка при загрузке новостей</p>';
  }
});

// Обработчик для кнопки "Удалить всё"
deleteAllBtn.addEventListener("click", deleteAllNews);

// Отображаем сохраненные новости при загрузке страницы
renderSavedNews();
// История переходов
let pageHistory = JSON.parse(sessionStorage.getItem("pageHistory")) || [];
let currentPageIndex = parseInt(sessionStorage.getItem("currentPageIndex")) || -1;

// Сохранить текущую страницу в историю
function saveCurrentPage() {
    const currentData = {
        url: window.location.href,
        scrollY: window.scrollY,
        searchQuery: searchInput.value,
        newsHTML: newsContainer.innerHTML
    };
    
    // Обрезаем историю если есть переходы вперед
    pageHistory = pageHistory.slice(0, currentPageIndex + 1);
    pageHistory.push(currentData);
    currentPageIndex++;
    
    // Ограничиваем историю 50 страницами
    if (pageHistory.length > 50) {
        pageHistory.shift();
        currentPageIndex--;
    }
    
    sessionStorage.setItem("pageHistory", JSON.stringify(pageHistory));
    sessionStorage.setItem("currentPageIndex", currentPageIndex);
    updateNavButtons();
}

// Загрузить страницу по индексу
function loadPage(index) {
    if (index >= 0 && index < pageHistory.length) {
        const page = pageHistory[index];
        currentPageIndex = index;
        
        // Восстанавливаем состояние
        searchInput.value = page.searchQuery || "";
        newsContainer.innerHTML = page.newsHTML || "";
        
        sessionStorage.setItem("currentPageIndex", currentPageIndex);
        updateNavButtons();
    }
}

// Обновить состояние кнопок
function updateNavButtons() {
    if (backBtn) {
        const canGoBack = currentPageIndex > 0;
        backBtn.disabled = !canGoBack;
        backBtn.style.opacity = canGoBack ? "1" : "0.5";
        backBtn.style.cursor = canGoBack ? "pointer" : "not-allowed";
    }
    
    if (forwardBtn) {
        const canGoForward = currentPageIndex < pageHistory.length - 1;
        forwardBtn.disabled = !canGoForward;
        forwardBtn.style.opacity = canGoForward ? "1" : "0.5";
        forwardBtn.style.cursor = canGoForward ? "pointer" : "not-allowed";
    }
}

// Кнопка назад
backBtn.addEventListener("click", () => {
    if (currentPageIndex > 0) {
        loadPage(currentPageIndex - 1);
    }
});

// Кнопка вперед
forwardBtn.addEventListener("click", () => {
    if (currentPageIndex < pageHistory.length - 1) {
        loadPage(currentPageIndex + 1);
    }
});

// Сохранять страницу при поиске
const originalSearchHandler = searchBtn.click;
searchBtn.addEventListener("click", () => {
    setTimeout(() => saveCurrentPage(), 100);
});

// Сохранять страницу при загрузке
window.addEventListener("load", () => {
    if (pageHistory.length === 0) {
        saveCurrentPage();
    }
    updateNavButtons();
});

// Сохранять при уходе со страницы
window.addEventListener("beforeunload", () => {
    saveCurrentPage();
});
// Делаем функции глобальными для доступа из onclick
window.saveNews = saveNews;
window.deleteNews = deleteNews;
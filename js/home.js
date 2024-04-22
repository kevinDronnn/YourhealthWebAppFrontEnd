let globalData; // Глобальная переменная для хранения данных
document.addEventListener("DOMContentLoaded", function () {
  // Функция для получения JWT токена из localStorage
  function getToken() {
    return localStorage.getItem("token");
  }

  // Функция для отправки аутентифицированных запросов с использованием JWT токена
  function sendAuthenticatedRequest(url, options) {
    // Получаем JWT токен из localStorage
    const token = getToken();

    // Добавляем токен к заголовкам запроса
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Отправляем запрос с обновленными опциями
    return fetch(url, options);
  }

  sendAuthenticatedRequest("http://localhost:8080/getCurrentParticipant", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Используем данные напрямую внутри обработчика события
      // console.log(data); // Выводим данные в консоль или делаем другие операции
      localStorage.setItem("username", data.username);
      localStorage.setItem("authority", data.authority);
      globalData = localStorage.getItem("username");
      if (globalData && globalData != null && globalData != "anonymousUser") {
        const navMenuList = document.querySelector(".nav-menu__list");
        const lastListItem = navMenuList.lastElementChild;
        const lastLink = lastListItem.querySelector("a");
        lastLink.setAttribute("href", "Profile.html");
        lastLink.innerText = "Profile";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

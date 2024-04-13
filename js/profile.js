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
      console.log(data); // Выводим данные в консоль или делаем другие операции
      globalData = data; // Сохраняем данные в глобальной переменной при необходимости
      getAdvices(data.username);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

const getAdvices = async (author) => {
  const response = await fetch(
    `http://localhost:8080/api/advices/author/${author}`
  );
  const advices = await response.json();
  const content = document.getElementById("advContent");
  console.log(advices);
  if (!advices || advices.length === 0) {
    const noAdv = document.createElement("h2");
    noAdv.classList.add("noAdv");
    noAdv.innerText = "You don`t have any advices";
    content.append(noAdv);
  }
  return renderAdviceItem(content, advices);
};

function renderAdviceItem(parent, item) {
  for (const itemContent of item) {
    const child_div = document.createElement("div");
    const child_div2 = document.createElement("ul");
    const child_div3 = document.createElement("li");
    const title = document.createElement("h3");
    const authorName = document.createElement("h3");
    const mainTitleDiv = document.createElement("div");
    const TitleDiv = document.createElement("div");
    const AuthorDiv = document.createElement("div");

    const paragraph = document.createElement("p");
    const deleteButton = document.createElement("button");

    child_div.classList.add("container3");
    child_div.classList.add("third-section__container3");
    child_div2.classList.add("third-section__advice-box");
    child_div3.classList.add("third-section__advice-item");
    child_div3.classList.add("advice-item");

    mainTitleDiv.classList.add("advice-item__mainTitleDiv");
    TitleDiv.classList.add("advice-item__TitleDiv");
    AuthorDiv.classList.add("advice-item__AuthorDiv");

    title.classList.add("advice-item__title");
    authorName.classList.add("advice-item__authorName");
    paragraph.classList.add("advice-item__text");
    deleteButton.classList.add("third-section__buttons-delete");

    title.innerText = itemContent.title;
    authorName.innerText = "Author: ";
    authorName.innerText += itemContent.authorName;
    paragraph.innerText = itemContent.description;
    deleteButton.innerText = "Delete";

    TitleDiv.append(title);
    AuthorDiv.append(authorName);
    mainTitleDiv.append(TitleDiv, AuthorDiv);

    child_div3.append(mainTitleDiv, paragraph, deleteButton);
    child_div2.append(child_div3);
    child_div.append(child_div2);
    parent.append(child_div);

    deleteButton.addEventListener("click", async () => {
      await deleteAdvice(item.id);
      await updateAdvices();
    });
  }
}

async function deleteAdvice(adviceId) {
  await fetch(`http://localhost:8080/api/advices/${adviceId}`, {
    method: "DELETE",
  });
}

function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
function outsideClick(event) {
  var modal = document.getElementById("modal");
  if (event.target == modal) {
    closeModal();
  }
}
// Модальное окно смены пароля.
document
  .getElementById("passwordForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
  });
/////////////////////////////

function openModal2() {
  document.getElementById("modal2").style.display = "block";
  // Добавляем обработчик события для закрытия модального окна при клике вне его
  window.addEventListener("click", outsideClick2);
}

function closeModal2() {
  document.getElementById("modal2").style.display = "none";
  // Удаляем обработчик события при закрытии модального окна
  window.removeEventListener("click", outsideClick2);
}

// Функция для проверки клика вне модального окна и его закрытия
function outsideClick2(event) {
  var modal = document.getElementById("modal2");
  if (event.target == modal) {
    closeModal2();
  }
}
// Добавляем обработчик события для кнопки "No"
document.getElementById("no").addEventListener("click", function (event) {
  closeModal2();
});

document.getElementById("yes").addEventListener("click", function (event) {
  event.preventDefault();
  closeModal2();
  // Send the fetch request to login endpoint
  fetch("http://localhost:8080/fullyLogout", {
    method: "POST",
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
    .then(() => {
      window.location.href = "loginPage.html";
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});

// Добавьте ваш код для обработки отправки формы здесь
document
  .getElementById("logoutForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Ваш JavaScript код для обработки отправки формы, например, отправка данных на сервер
  });

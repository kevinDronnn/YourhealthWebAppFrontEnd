let globalData = localStorage.getItem("username"); // Глобальная переменная для хранения данных
let authority = localStorage.getItem("authority"); // Глобальная переменная для хранения данных
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
      // globalData = data; // Сохраняем данные в глобальной переменной при необходимости
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

const getAdvices = async () => {
  const response = await fetch("http://localhost:8080/api/advices");
  const advices = await response.json();
  return advices;
};

function getSelectedValue() {
  const value = document.getElementById("filter_list").value;
  return value;
}

const renderAdvices = async () => {
  const advice = await getAdvices();
  const main_div = document.querySelector(".second-section");
  main_div.innerHTML = "";

  const selectedValue = getSelectedValue();

  let filteredAdvice = advice;

  if (selectedValue === "reverse") {
    filteredAdvice = advice.reverse();
  }

  const searchInputValue = document
    .querySelector(".main-section__zone-search")
    .value.toLowerCase();

  for (const item of filteredAdvice) {
    if (item.title.toLowerCase().includes(searchInputValue)) {
      renderAdviceItem(main_div, item);
    }
  }
};

function renderAdviceItem(parent, item) {
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

  child_div.classList.add("container");
  child_div.classList.add("second-section__container");
  child_div2.classList.add("second-section__advice-box");
  child_div3.classList.add("second-section__advice-item");
  child_div3.classList.add("advice-item");

  mainTitleDiv.classList.add("advice-item__mainTitleDiv");
  TitleDiv.classList.add("advice-item__TitleDiv");
  AuthorDiv.classList.add("advice-item__AuthorDiv");

  title.classList.add("advice-item__title");
  authorName.classList.add("advice-item__authorName");
  paragraph.classList.add("advice-item__text");
  deleteButton.classList.add("main-section__buttons-delete");

  title.innerText = item.title;
  authorName.innerText = "Author: ";
  authorName.innerText += item.authorName;
  paragraph.innerText = item.description;
  deleteButton.innerText = "Delete";

  TitleDiv.append(title);
  AuthorDiv.append(authorName);
  mainTitleDiv.append(TitleDiv, AuthorDiv);

  if (authority === "ADMIN") {
    child_div3.append(mainTitleDiv, paragraph, deleteButton);
  } else {
    child_div3.append(mainTitleDiv, paragraph);
  }

  child_div2.append(child_div3);
  child_div.append(child_div2);
  parent.appendChild(child_div);

  deleteButton.addEventListener("click", async () => {
    await deleteAdvice(item.id);
    await updateAdvices();
  });
}

async function updateAdvices() {
  await renderAdvices();
}

async function deleteAdvice(adviceId) {
  await fetch(`http://localhost:8080/api/advices/${adviceId}`, {
    method: "DELETE",
  });
}

document
  .getElementById("filter_list")
  .addEventListener("change", updateAdvices);
document
  .querySelector(".main-section__zone-search")
  .addEventListener("input", updateAdvices);

const addButton = document.getElementById("add");
const modal = document.getElementById("addModal");
const closeModalButton = document.getElementById("closeModal");
const submitButton = document.getElementById("submitAdvice");

addButton.addEventListener("click", () => {
  if (globalData != null || !isNaN(globalData)) {
    modal.style.display = "block";
  } else {
    window.location.href = "loginPage.html";
  }
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

submitButton.addEventListener("click", async () => {
  const titleInput = document.getElementById("titleInput").value;
  const descriptionInput = document.getElementById("descriptionInput").value;

  if (titleInput != "" && descriptionInput != "") {
    await fetch("http://localhost:8080/api/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleInput,
        description: descriptionInput,
        authorName: globalData,
      }),
    });

    modal.style.display = "none";
    await updateAdvices();
  } else {
    alert("Please enter all information.");
  }
});

renderAdvices();

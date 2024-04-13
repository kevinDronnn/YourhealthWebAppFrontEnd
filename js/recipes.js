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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function openModal() {
  console.log(globalData);
  if (globalData.username != null || !isNaN(globalData.username)) {
    document.getElementById("modal").style.display = "block";
  } else {
    window.location.href = "loginPage.html";
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("add").addEventListener("click", function () {
  openModal();
});
document.getElementById("closeModal").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
  document.getElementById("overlay").style.display = "none";
});

document.getElementById("addFields").addEventListener("click", function () {
  addFields();
  event.stopPropagation();
});

function addFields() {
  var lproductList = document.getElementById("l-productList");

  var newInputLeft = document.createElement("input");
  newInputLeft.setAttribute("type", "text");
  newInputLeft.setAttribute("name", "products_name[]");
  newInputLeft.setAttribute("placeholder", "name");
  newInputLeft.classList.add("left");
  newInputLeft.classList.add("modalField");

  var newInputRight = document.createElement("input");
  newInputRight.setAttribute("type", "text");
  newInputRight.setAttribute("name", "products_grams[]");
  newInputRight.setAttribute("placeholder", "grams");
  newInputRight.classList.add("right");
  newInputRight.classList.add("modalField");

  var lileft = document.createElement("li");
  lileft.classList.add("li-left");

  lileft.appendChild(newInputLeft);
  lileft.appendChild(newInputRight);
  lproductList.appendChild(lileft);
}

$(document).ready(function () {
  $("#submitButton").click(function () {
    var formData = new FormData($("#combinedForm")[0]);

    $(".li-left").each(function (index) {
      var productName = $(this).find('input[name="products_name[]"]').val();
      var productGrams = $(this).find('input[name="products_grams[]"]').val();

      formData.append("products_name", productName);
      formData.append("products_grams", productGrams);
    });
    formData.append("authorName", globalData.username);
    $.ajax({
      url: "http://localhost:8080/api/recipe",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  });
});

const second_section = document.querySelector(".second-section");
const filterList = document.getElementById("filter_list");
const searchInput = document.getElementById("searchInput");
let recipeDataComment;
function openModalSecond(recipe) {
  recipeDataComment = recipe;
  console.log(recipeDataComment);
  const modalSecond = document.createElement("div");
  modalSecond.classList.add("modal-second");
  const naming = recipe.image;
  const extension = naming.substring(naming.lastIndexOf("\\"));

  const modalContentSecond = document.createElement("div");
  modalContentSecond.classList.add("modal-content-second");

  const contentContainer = document.createElement("div");
  contentContainer.classList.add("containerModal");
  const imageElement = document.createElement("img");
  imageElement.src = `images/Recipces Page/${extension}`;
  imageElement.height = 370;
  imageElement.width = 370;
  imageElement.classList.add("imgModal");

  const headerElement = document.createElement("h2");
  headerElement.classList.add("headerModal");
  headerElement.innerText = recipe.name;

  const authorName = document.createElement("h2");
  authorName.innerText = "Author: ";
  authorName.innerText += recipe.authorName;
  authorName.classList.add("authorNameModald");

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("parModal");
  descriptionElement.innerText = recipe.description;
  modalContentSecond.appendChild(imageElement);
  modalContentSecond.appendChild(headerElement);

  const productListHeading = document.createElement("h3");
  productListHeading.classList.add("head");
  productListHeading.innerText = "Product List:";
  modalContentSecond.appendChild(productListHeading);

  const productList = document.createElement("ul");
  productList.classList.add("product-list");
  // recipe.products.forEach((product) => {
  //   const listItem = document.createElement("li");
  //   listItem.innerText = `${product.productName}: ${product.grams} grams`;
  //   productList.appendChild(listItem);
  // });
  recipe.products.forEach((product) => {
    const listItem = document.createElement("li");
    const listItemProductName = document.createElement("label");
    const listItemProductGrams = document.createElement("label");
    listItemProductName.classList.add("listItemProductName");

    listItemProductName.innerText = product.productName;
    listItemProductGrams.innerText = product.grams;

    listItem.append(listItemProductName);
    listItem.append(": ");
    listItem.append(listItemProductGrams);
    productList.appendChild(listItem);
  });

  const commentAddTitle = document.createElement("h2");
  commentAddTitle.innerText = "Comments: ";
  commentAddTitle.classList.add("commentAddTitle");

  const commentAddConteiner = document.createElement("div");
  commentAddConteiner.classList.add("commentAddConteiner");

  const commentAddContent = document.createElement("div");
  commentAddContent.classList.add("commentAddContent");

  const form = document.createElement("form");
  form.setAttribute("id", "commentForm");

  const commentAddText = document.createElement("textarea");
  commentAddText.classList.add("commentAddText");
  commentAddText.setAttribute("placeholder", "Enter your comment...");
  commentAddText.setAttribute("required", "required");

  const commentAddButton = document.createElement("input");
  commentAddButton.setAttribute("type", "submit");
  commentAddButton.value = "Add";
  commentAddButton.classList.add("commentAddButton");

  const commentAddHr = document.createElement("hr");
  commentAddHr.classList.add("commentAddHr");

  let commentShowedConteiner;
  recipe.commentsList.forEach((comment) => {
    commentShowedConteiner = document.createElement("div"); //коммент заготовка
    commentShowedConteiner.classList.add("commentShowedConteiner"); //коммент заготовка

    const commentShowedTitle = document.createElement("h2"); //коммент заготовка
    commentShowedTitle.innerText = "Author: " + comment.authorName; //коммент заготовка
    commentShowedTitle.classList.add("commentShowedTitle"); //коммент заготовка

    const commentShowedText = document.createElement("p"); //коммент заготовка
    commentShowedText.innerText = comment.text; //коммент заготовка
    commentShowedText.classList.add("commentShowedText"); //коммент заготовка

    commentShowedConteiner.appendChild(commentShowedTitle); //коммент заготовка
    commentShowedConteiner.appendChild(commentShowedText); //коммент заготовка
  });

  form.appendChild(commentAddText);
  form.appendChild(commentAddButton);
  commentAddContent.appendChild(form);
  commentAddContent.appendChild(commentAddHr);

  commentAddConteiner.appendChild(commentAddContent);

  contentContainer.appendChild(authorName);
  contentContainer.appendChild(descriptionElement);
  contentContainer.appendChild(productListHeading);
  contentContainer.appendChild(productList);
  contentContainer.appendChild(commentAddTitle);
  contentContainer.appendChild(commentAddConteiner);

  contentContainer.appendChild(commentShowedConteiner); //коммент заготовка

  modalContentSecond.appendChild(contentContainer);

  modalSecond.appendChild(modalContentSecond);
  document.body.appendChild(modalSecond);

  // Добавляем обработчик события для кнопки
  commentAddButton.addEventListener("click", function (event) {
    event.preventDefault(); // Предотвращаем стандартное действие кнопки

    const commentText = commentAddText.value.trim(); // Получаем текст из textarea и удаляем лишние пробелы

    // Если текст комментария не пустой, отправляем его на сервер
    if (commentText !== "") {
      sendData(commentText); // Вызываем функцию для отправки данных
    } else {
      alert("Please enter a comment."); // Если поле пустое, выводим сообщение об ошибке
    }
  });

  modalSecond.addEventListener("click", (event) => {
    if (event.target === modalSecond) {
      modalSecond.remove();
    }
  });
  fetchAndDisplayRecipes();
}

function fetchAndDisplayRecipes() {
  fetch("http://localhost:8080/api/recipe")
    .then((response) => response.json())
    .then((data) => {
      if (filterList.value === "reverse") {
        data.reverse();
      }
      second_section.innerHTML = "";
      recipeData = data;
      const searchQuery = searchInput.value.toLowerCase().split(" ");

      data.forEach((recipe) => {
        const recipeName = recipe.name.toLowerCase();
        const productNames = recipe.products.map((product) =>
          product.productName.toLowerCase()
        );

        if (
          searchQuery.every(
            (query) =>
              recipeName.includes(query) ||
              productNames.some((productName) => productName.includes(query))
          )
        ) {
          const container = document.createElement("div");
          container.classList.add("container", "second-section__container");
          container.setAttribute("id", "foodContainer");

          const list = document.createElement("ul");
          list.classList.add("second-section__food-box");
          const list_item = document.createElement("li");
          list_item.classList.add("second-section__food-item", "food-item");

          const naming = recipe.image;
          const extension = naming.substring(naming.lastIndexOf("\\"));

          const list_img = document.createElement("img");
          list_img.setAttribute("src", "images/Recipces Page/" + extension);
          list_img.setAttribute("height", "370");
          list_img.setAttribute("width", "370");
          list_img.classList.add("food-item__img");

          const list_header = document.createElement("h3");
          list_header.classList.add("food-item__title");
          const list_par = document.createElement("p");
          list_par.classList.add("food-item__text");
          const deleteButton = document.createElement("button");

          deleteButton.classList.add("main-section__buttons");
          deleteButton.classList.add("deleteBtn");
          deleteButton.innerText = "Delete";

          list_header.innerText = recipe.name;
          list_par.innerText = recipe.description;
          list_item.appendChild(list_img);
          list_item.appendChild(list_header);
          list_item.appendChild(list_par);
          list_item.appendChild(deleteButton);

          container.addEventListener("click", () => {
            openModalSecond(recipe);
          });

          list.appendChild(list_item);
          container.appendChild(list);
          second_section.appendChild(container);

          deleteButton.addEventListener("click", async () => {
            await deleteRecipe(recipe.id);
            await fetchAndDisplayRecipes();
          });
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

async function deleteRecipe(recipeId) {
  await fetch(`http://localhost:8080/api/recipe/${recipeId}`, {
    method: "DELETE",
  });
}

// Функция для отправки данных на сервер
function sendData(comment) {
  console.log(comment);
  // URL сервера
  const url = "http://localhost:8080/api/comment";

  // Получаем имя автора, например, из глобальных данных
  const authorName = globalData.username;

  // Проверяем, что комментарий и имя автора заполнены
  if (comment && authorName) {
    // Тело запроса (отправляем текст комментария и имя автора)
    const body = JSON.stringify({
      text: comment,
      authorName: authorName,
      recipes: recipeDataComment.id,
    });
    console.log(body);

    // Опции запроса
    const options = {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    };

    // Отправка запроса на сервер
    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Обработка успешного ответа от сервера
        console.log(data);
      })
      .catch((error) => {
        // Обработка ошибки
        console.error("There was an error!", error);
      });
  } else {
    alert("Please enter a comment."); // Если поля пустые, выводим сообщение об ошибке
  }
}

fetchAndDisplayRecipes();

filterList.addEventListener("change", fetchAndDisplayRecipes);
searchInput.addEventListener("input", fetchAndDisplayRecipes);

let globalData = localStorage.getItem("username"); // Глобальная переменная для хранения данных
let emailUser;
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
      // // Используем данные напрямую внутри обработчика события
      // console.log(data); // Выводим данные в консоль или делаем другие операции
      // globalData = data; // Сохраняем данные в глобальной переменной при необходимости
      const usernameP = document.getElementById("userUsername");
      usernameP.innerText += " " + globalData;
      fetch(`http://localhost:8080/gettingEmail/username/${globalData}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          // Возвращаем просто текст, а не JSON
          return response.text();
        })
        .then((data) => {
          emailUser = data; // Сохраняем email в переменной
          const emailP = document.getElementById("userEmail");
          emailP.innerText += " " + data; // Выводим email на страницу
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
      getAdvices(globalData);
      getRecipes(globalData);
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
  if (!advices || advices.length == 0) {
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
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  window.location.href = "loginPage.html";
});

// Добавьте ваш код для обработки отправки формы здесь
document
  .getElementById("logoutForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    // Ваш JavaScript код для обработки отправки формы, например, отправка данных на сервер
  });

const passwordForm = document.getElementById("passwordForm");
const oldPasswordInput = document.getElementById("oldPassword");
const newPasswordInput = document.getElementById("newPassword");
const userEmailElement = document.getElementById("userEmail");
const userUsernameElement = document.getElementById("userUsername");

passwordForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const userEmail = userEmailElement.textContent.split(": ")[1].trim();
  const userUsername = userUsernameElement.textContent.split(": ")[1].trim();

  const oldPassword = oldPasswordInput.value;
  const newPassword = newPasswordInput.value;

  const formData = new FormData();
  formData.append("oldPassword", oldPassword.trim());
  formData.append("newPassword", newPassword.trim());
  formData.append("email", userEmail.trim());
  formData.append("name", userUsername.trim());

  fetch("http://localhost:8080/updatePass", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    })
    .then((data) => {
      // data содержит текстовое сообщение от сервера
      alert("Password was changed");
      closeModal();
    })
    .catch((error) => {
      alert("Wrong password");
    });
});

const getRecipes = async (author) => {
  const response = await fetch(
    `http://localhost:8080/api/recipe/author/${author}`
  );
  const recipes = await response.json();
  const content = document.getElementById("recipeContent");
  console.log(recipes);
  if (!recipes || recipes.length == 0) {
    const noRecipe = document.createElement("h2");
    noRecipe.classList.add("noRecipe");
    noRecipe.innerText = "You don`t have any recipes";
    content.append(noRecipe);
  }
  return renderRecipeItem(content, recipes);
};

const renderRecipeItem = async (parent, items) => {
  for (const item of items) {
    // Iterate over each item in the array
    const child_div = document.createElement("div");
    const child_div2 = document.createElement("ul");
    const child_div3 = document.createElement("li");
    const title = document.createElement("h3");
    const authorName = document.createElement("h3");
    const mainTitleDiv = document.createElement("div");
    const TitleDiv = document.createElement("div");
    const AuthorDiv = document.createElement("div");
    const image = document.createElement("img");
    const divDescImg = document.createElement("div");

    const paragraph = document.createElement("p");
    const deleteButton = document.createElement("button");

    child_div.classList.add("container3");
    child_div.classList.add("fourth-section__container4");
    child_div2.classList.add("fourth-section__advice-box");
    child_div3.classList.add("fourth-section__advice-item");
    child_div3.classList.add("recipe-item2");

    mainTitleDiv.classList.add("recipe-item2__mainTitleDiv");
    TitleDiv.classList.add("recipe-item2__TitleDiv");
    AuthorDiv.classList.add("recipe-item2__AuthorDiv");

    title.classList.add("recipe-item2__title");
    authorName.classList.add("recipe-item2__authorName");
    paragraph.classList.add("recipe-item2__text");
    deleteButton.classList.add("fourth-section__buttons-delete");

    divDescImg.classList.add("fourth-section__divDescImg");

    image.classList.add("recipeImageClass");

    const naming = item.image; // Access the image property of the current item
    if (naming) {
      const extension = naming.substring(naming.lastIndexOf("\\"));
      image.setAttribute("src", "images/Recipces Page/" + extension);
      image.setAttribute("width", "150px");
      image.setAttribute("height", "150px");
    }

    title.innerText = item.name;
    authorName.innerText = "Author: ";
    authorName.innerText += item.authorName;
    paragraph.innerText = item.description;
    deleteButton.innerText = "Delete";

    TitleDiv.append(title);
    AuthorDiv.append(authorName);
    mainTitleDiv.append(TitleDiv, AuthorDiv);
    divDescImg.append(image, paragraph);
    child_div3.append(mainTitleDiv, divDescImg, deleteButton);
    child_div2.append(child_div3);
    child_div.append(child_div2);
    parent.append(child_div);

    child_div.addEventListener("click", () => {
      openModalSecond(item);
    });

    deleteButton.addEventListener("click", async () => {
      await deleteRecipe(item.id);
    });
  }
};

async function deleteRecipe(recipeId) {
  await fetch(`http://localhost:8080/api/delete/${recipeId}`, {
    method: "DELETE",
  });
}

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
    listItem.classList.add("listItemProductName");

    listItemProductName.innerText = product.productName;
    listItemProductGrams.innerText = product.grams;

    listItem.append(listItemProductName);
    listItem.append(": ");
    listItem.append(listItemProductGrams);
    productList.appendChild(listItem);
  });

  const totalRecipeInfo = document.createElement("div");
  const totalGramsRecipe = document.createElement("p");
  const totalCalsRecipe = document.createElement("p");
  const totalCarbsRecipe = document.createElement("p");
  const totalProteinsRecipe = document.createElement("p");
  const totalFatsRecipe = document.createElement("p");

  totalRecipeInfo.classList.add("recipeInfo");
  totalGramsRecipe.classList.add("recipeInfoP");
  totalCalsRecipe.classList.add("recipeInfoP");
  totalCarbsRecipe.classList.add("recipeInfoP");
  totalProteinsRecipe.classList.add("recipeInfoP");
  totalFatsRecipe.classList.add("recipeInfoP");

  totalGramsRecipe.textContent = "Total grams: " + recipe.grams;
  totalCalsRecipe.textContent = "Total cals: " + recipe.cals;
  totalCarbsRecipe.textContent = "Total carbs: " + recipe.carbs;
  totalProteinsRecipe.textContent = "Total proteins: " + recipe.proteins;
  totalFatsRecipe.textContent = "Total fats: " + recipe.fats;

  totalRecipeInfo.append(totalGramsRecipe);
  totalRecipeInfo.append(totalCalsRecipe);
  totalRecipeInfo.append(totalCarbsRecipe);
  totalRecipeInfo.append(totalProteinsRecipe);
  totalRecipeInfo.append(totalFatsRecipe);

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
    if (comment || comment.length != 0) {
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
    }
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
  contentContainer.appendChild(totalRecipeInfo);
  contentContainer.appendChild(commentAddTitle);
  contentContainer.appendChild(commentAddConteiner);
  // const commentAddTitle = document.createElement("h2");
  // commentAddTitle.innerText = "Comments: ";
  // commentAddTitle.classList.add("commentAddTitle");

  // const commentAddConteiner = document.createElement("div");
  // commentAddConteiner.classList.add("commentAddConteiner");

  // const commentAddContent = document.createElement("div");
  // commentAddContent.classList.add("commentAddContent");

  // const form = document.createElement("form");
  // form.setAttribute("id", "commentForm");

  // const commentAddText = document.createElement("textarea");
  // commentAddText.classList.add("commentAddText");
  // commentAddText.setAttribute("placeholder", "Enter your comment...");
  // commentAddText.setAttribute("required", "required");

  // const commentAddButton = document.createElement("input");
  // commentAddButton.setAttribute("type", "submit");
  // commentAddButton.value = "Add";
  // commentAddButton.classList.add("commentAddButton");

  // const commentAddHr = document.createElement("hr");
  // commentAddHr.classList.add("commentAddHr");

  // let commentShowedConteiner;
  // recipe.commentsList.forEach((comment) => {
  //   if (comment || comment.length != 0) {
  //     commentShowedConteiner = document.createElement("div"); //коммент заготовка
  //     commentShowedConteiner.classList.add("commentShowedConteiner"); //коммент заготовка

  //     const commentShowedTitle = document.createElement("h2"); //коммент заготовка
  //     commentShowedTitle.innerText = "Author: " + comment.authorName; //коммент заготовка
  //     commentShowedTitle.classList.add("commentShowedTitle"); //коммент заготовка

  //     const commentShowedText = document.createElement("p"); //коммент заготовка
  //     commentShowedText.innerText = comment.text; //коммент заготовка
  //     commentShowedText.classList.add("commentShowedText"); //коммент заготовка

  //     commentShowedConteiner.appendChild(commentShowedTitle); //коммент заготовка
  //     commentShowedConteiner.appendChild(commentShowedText); //коммент заготовка
  //   }
  // });

  // form.appendChild(commentAddText);
  // form.appendChild(commentAddButton);
  // commentAddContent.appendChild(form);
  // commentAddContent.appendChild(commentAddHr);

  // commentAddConteiner.appendChild(commentAddContent);

  // contentContainer.appendChild(authorName);
  // contentContainer.appendChild(descriptionElement);
  // contentContainer.appendChild(productListHeading);
  // contentContainer.appendChild(productList);
  // contentContainer.appendChild(commentAddTitle);
  // contentContainer.appendChild(commentAddConteiner);
  if (commentShowedConteiner) {
    contentContainer.appendChild(commentShowedConteiner); //коммент заготовка
  }

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
}

// Функция для отправки данных на сервер
function sendData(comment) {
  console.log(comment);
  // URL сервера
  const url = "http://localhost:8080/api/comment";

  // Получаем имя автора, например, из глобальных данных
  const authorName = globalData;

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

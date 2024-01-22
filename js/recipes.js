function openModal() {
  document.getElementById("modal").style.display = "block";
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

  lileft.appendChild(newInputLeft, newInputRight);
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

function openModalSecond(recipe) {

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

  const descriptionElement = document.createElement("p");
  descriptionElement.classList.add("parModal");
  descriptionElement.innerText = recipe.description;
  modalContentSecond.appendChild(imageElement);
  modalContentSecond.appendChild(headerElement);

  const productListHeading = document.createElement("h3");
  productListHeading.classList.add("head")
  productListHeading.innerText = "Product List:";
  modalContentSecond.appendChild(productListHeading);

  const productList = document.createElement("ul");
  productList.classList.add("product-list");
  recipe.products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.innerText = `${product.productName}: ${product.grams} grams`;
    productList.appendChild(listItem);
  });
  contentContainer.appendChild(descriptionElement);
  contentContainer.appendChild(productListHeading);
  contentContainer.appendChild(productList);
  modalContentSecond.appendChild(contentContainer);

  modalSecond.appendChild(modalContentSecond);
  document.body.appendChild(modalSecond);

  modalSecond.addEventListener("click", (event) => {
    if (event.target === modalSecond) {
      modalSecond.remove();
    }
  });
}

function fetchAndDisplayRecipes() {
  fetch("http://localhost:8080/api/recipe")
    .then((response) => response.json())
    .then((data) => {
      if (filterList.value === "reverse") {
        data.reverse();
      }

      second_section.innerHTML = "";

      const searchQuery = searchInput.value.toLowerCase();

      data.forEach((product) => {
        if (product.name.toLowerCase().includes(searchQuery)) {
          const container = document.createElement("div");
          container.classList.add("container", "second-section__container");
          container.setAttribute("id", "foodContainer");

          const list = document.createElement("ul");
          list.classList.add("second-section__food-box");
          const list_item = document.createElement("li");
          list_item.classList.add("second-section__food-item", "food-item");

          const naming = product.image;
          const extension = naming.substring(naming.lastIndexOf("\\"));

          const list_img = document.createElement("img", "food-item__img");
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

          list_header.innerText = product.name;
          list_par.innerText = product.description;
          list_item.appendChild(list_img);
          list_item.appendChild(list_header);
          list_item.appendChild(list_par);
          list_item.appendChild(deleteButton);

          container.addEventListener("click", () => {
            openModalSecond(product);
          });

          list.appendChild(list_item);
          container.appendChild(list);
          second_section.appendChild(container);

          deleteButton.addEventListener("click", async () => {
            await deleteRecipe(product.id);
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

fetchAndDisplayRecipes();

filterList.addEventListener("change", fetchAndDisplayRecipes);
searchInput.addEventListener("input", fetchAndDisplayRecipes);

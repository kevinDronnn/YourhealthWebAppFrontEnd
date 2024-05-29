let globalData = localStorage.getItem("username"); // Глобальная переменная для хранения данных
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

$(document).ready(function () {
  var lastSelectedLabel = null;

  $(".radio-button").click(function () {
    var groupName = $(this).prev().attr("name");

    if (
      lastSelectedLabel !== null &&
      lastSelectedLabel.prev().attr("name") === groupName
    ) {
      lastSelectedLabel.removeClass("selected-label");
    }

    $(this).addClass("selected-label");

    lastSelectedLabel = $(this);

    $(this).prev().prop("checked", true);
  });
});

$(document).ready(function () {
  var lastSelectedLabel2 = null;

  $(".radio-button2").click(function () {
    var groupName = $(this).prev().attr("name");
    var selectedValue = $(this).prev().val();

    if (
      lastSelectedLabel2 !== null &&
      lastSelectedLabel2.prev().attr("name") === groupName
    ) {
      lastSelectedLabel2.removeClass("selected-label2");
    }

    $(this).addClass("selected-label2");

    lastSelectedLabel2 = $(this);

    $(this).prev().prop("checked", true);
  });
});
let resOfCalcGlobal;
function calculateAndOutputResult() {
  var weight = parseFloat($(".input-text:eq(1)").val());
  var height = parseFloat($(".input-text:eq(0)").val());
  var age = parseInt($(".input-text:eq(2)").val(), 10);
  var activityLevel = parseFloat(
    $(".second-section__select").val().replace(",", ".")
  ).toFixed(2);
  var gender = $("input[name='gender']:checked").val();
  var goal = $("input[name='goal']:checked").val();
  if (
    !isNaN(weight) &&
    !isNaN(height) &&
    !isNaN(age) &&
    !isNaN(activityLevel) &&
    gender !== undefined &&
    goal !== undefined
  ) {
    var result =
      (weight * 10 + height * 6.25 - age * 5 + (gender === "m" ? 5 : -161)) *
      activityLevel;
    result = parseInt(result, 10);

    if (goal === "m") {
      $(".second-section__calculate").val("Result: " + result);
    } else if (goal === "b") {
      result = parseInt(result * 1.2, 10);
      $(".second-section__calculate").val("Result: " + result);
    } else {
      result = parseInt(result * 0.8, 10);
      $(".second-section__calculate").val("Result: " + result);
    }
    resOfCalcGlobal = result;
    console.log("Result of calculation:", result);
    return result;
  } else {
    alert("Please enter all information.");
  }
}

document
  .getElementById("calculateButton")
  .addEventListener("click", function () {
    calculateAndOutputResult();
  });

document.addEventListener("DOMContentLoaded", function () {
  var selectedCell;
  var products;
  var recipes;

  fetch("http://localhost:8080/api/products")
    .then((response) => response.json())
    .then((loadedProducts) => {
      products = loadedProducts;
    })
    .catch((error) => console.error("Error loading products:", error));

  fetch(`http://localhost:8080/api/recipe/author/${globalData}`)
    .then((data) => data.json())
    .then((loadedRecipes) => {
      recipes = loadedRecipes;
    })
    .catch((error) => console.error("Error loading recipes:", error));
  for (let i = 1; i <= 3; i++) {
    initializeTableListeners(i);
  }

  var totalContainer = document.createElement("div");
  totalContainer.id = "totalContainer";
  totalContainer.innerHTML = "<h2>Total Values for All Tables</h2>";
  totalContainer.style.color = "white";
  totalContainer.style.textAlign = "center";
  totalContainer.style.position = "relative";
  totalContainer.style.left = "100px";

  document.body.appendChild(totalContainer);
  let which;
  function initializeTableListeners(tableIndex) {
    var tableId = "mealTable" + tableIndex;
    var modalId = "myModal" + tableIndex;
    var modalContentId = "modalContent" + tableIndex;

    var table = document.getElementById(tableId);

    table.addEventListener("click", function (event) {
      var targetCell = event.target;

      if (targetCell.classList.contains("food")) {
        selectedCell = targetCell;

        var modalContent = document.getElementById(modalContentId);
        if (modalContent) {
          modalContent.innerHTML = "";
          const productContent = document.createElement("div");
          productContent.setAttribute("id", "contentProducts");

          products.forEach(function (product) {
            var button = document.createElement("button");
            button.classList.add("buttonModal");
            button.setAttribute("name", "product");
            button.textContent = product.name;
            console.log(product);

            button.addEventListener("click", function () {
              if (selectedCell && button.getAttribute("name") == "product") {
                var row = selectedCell.closest("tr");
                which = "product";
                var gramsInput = row.querySelector(".editable-grams");
                gramsInput.value = product.grams;

                row.cells[0].textContent = product.name;
                row.cells[2].textContent = (
                  (product.cals * (parseFloat(gramsInput.value) || 0)) /
                  product.grams
                ).toFixed(2);
                row.cells[3].textContent = (
                  (product.proteins * (parseFloat(gramsInput.value) || 0)) /
                  product.grams
                ).toFixed(2);
                row.cells[4].textContent = (
                  (product.carbs * (parseFloat(gramsInput.value) || 0)) /
                  product.grams
                ).toFixed(2);
                row.cells[5].textContent = (
                  (product.fats * (parseFloat(gramsInput.value) || 0)) /
                  product.grams
                ).toFixed(2);

                updateTotalValues(table);
                updateTotalValuesForAllTables();
                displayTotalValuesForAllTables();
              }

              document.getElementById(modalId).style.display = "none";
            });

            productContent.appendChild(button);
            modalContent.appendChild(productContent);
          });
          /////////////////////////////////////////////////
          const par = document.createElement("p");
          par.classList.add("parMeelRecipe");
          par.innerText = "Your recipes: ";
          const recipeContent = document.createElement("div");
          recipeContent.setAttribute("id", "contentRecipes");
          recipeContent.append(par);
          modalContent.append(recipeContent);
          if (recipes.length == 0) {
            var parNoRecipes = document.createElement("p");
            parNoRecipes.innerText = "You don`t have any recipes";
            parNoRecipes.classList.add("parNoRecipes");
            recipeContent.appendChild(parNoRecipes);
          } else {
            recipes.forEach(function (recipe) {
              var button = document.createElement("button");
              button.classList.add("buttonModal");
              button.textContent = recipe.name;
              button.setAttribute("name", "recipe");

              button.addEventListener("click", function () {
                if (selectedCell && button.getAttribute("name") == "recipe") {
                  var row = selectedCell.closest("tr");
                  which = "recipe";
                  var gramsInput = row.querySelector(".editable-grams");
                  gramsInput.value = recipe.grams;

                  row.cells[0].textContent = recipe.name;
                  row.cells[2].textContent = (
                    (recipe.cals * (parseFloat(gramsInput.value) || 0)) /
                    recipe.grams
                  ).toFixed(2);
                  row.cells[3].textContent = (
                    (recipe.proteins * (parseFloat(gramsInput.value) || 0)) /
                    recipe.grams
                  ).toFixed(2);
                  row.cells[4].textContent = (
                    (recipe.carbs * (parseFloat(gramsInput.value) || 0)) /
                    recipe.grams
                  ).toFixed(2);
                  row.cells[5].textContent = (
                    (recipe.fats * (parseFloat(gramsInput.value) || 0)) /
                    recipe.grams
                  ).toFixed(2);

                  updateTotalValues(table);
                  updateTotalValuesForAllTables();
                  displayTotalValuesForAllTables();
                }

                document.getElementById(modalId).style.display = "none";
              });

              recipeContent.appendChild(button);
            });
          }
          ////////////////////////////////////////////////
          document.getElementById(modalId).style.display = "block";
        } else {
          console.error(modalContentId + " element not found");
        }
      }
    });

    table.addEventListener("input", function (event) {
      var targetInput = event.target;

      if (targetInput.classList.contains("editable-grams")) {
        if (!products && !recipes) {
          console.error("Products array not loaded");
          return;
        }

        if (which == "product") {
          var row = targetInput.closest("tr");
          var product = getProductByName(row.cells[0].textContent);

          row.cells[2].textContent = (
            (product.cals * (parseFloat(targetInput.value) || 0)) /
            product.grams
          ).toFixed(2);
          row.cells[3].textContent = (
            (product.proteins * (parseFloat(targetInput.value) || 0)) /
            product.grams
          ).toFixed(2);
          row.cells[4].textContent = (
            (product.carbs * (parseFloat(targetInput.value) || 0)) /
            product.grams
          ).toFixed(2);
          row.cells[5].textContent = (
            (product.fats * (parseFloat(targetInput.value) || 0)) /
            product.grams
          ).toFixed(2);
        } else {
          var row = targetInput.closest("tr");
          var recipe = getRecipeByName(row.cells[0].textContent);

          row.cells[2].textContent = (
            (recipe.cals * (parseFloat(targetInput.value) || 0)) /
            recipe.grams
          ).toFixed(2);
          row.cells[3].textContent = (
            (recipe.proteins * (parseFloat(targetInput.value) || 0)) /
            recipe.grams
          ).toFixed(2);
          row.cells[4].textContent = (
            (recipe.carbs * (parseFloat(targetInput.value) || 0)) /
            recipe.grams
          ).toFixed(2);
          row.cells[5].textContent = (
            (recipe.fats * (parseFloat(targetInput.value) || 0)) /
            recipe.grams
          ).toFixed(2);
        }
        updateTotalValues(table);
        displayTotalValuesForAllTables();
      }
    });

    var closeButton = document.querySelector("#" + modalId + " .close");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        document.getElementById(modalId).style.display = "none";
      });
    }

    var modal = document.getElementById(modalId);
    var modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.addEventListener("click", function (event) {
        if (event.target === modalContent) {
          modal.style.display = "none";
        }
      });
    }

    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document.getElementById(modalId).style.display = "none";
      }
    });
    updateTotalValuesForAllTables();
    displayTotalValuesForAllTables();
  }

  function updateTotalValues(table) {
    // console.log("Updating total values for table:", table.id);
    var rows = table.querySelectorAll("tr:not(:first-child):not(:last-child)");

    var totalGrams = 0,
      totalCals = 0,
      totalProteins = 0,
      totalCarbs = 0,
      totalFats = 0;

    rows.forEach(function (row) {
      var gramsInput = row.querySelector(".editable-grams");
      totalGrams += parseFloat(gramsInput.value) || 0;
      totalCals += parseFloat(row.cells[2].textContent) || 0;
      totalProteins += parseFloat(row.cells[3].textContent) || 0;
      totalCarbs += parseFloat(row.cells[4].textContent) || 0;
      totalFats += parseFloat(row.cells[5].textContent) || 0;
    });

    var totalGramsCell = table.querySelector(
      ".last.total#totalGrams" + table.id.charAt(table.id.length - 1)
    );
    var totalCalsCell = table.querySelector(
      ".last.total#totalCals" + table.id.charAt(table.id.length - 1)
    );
    var totalProteinsCell = table.querySelector(
      ".last.total#totalProteins" + table.id.charAt(table.id.length - 1)
    );
    var totalCarbsCell = table.querySelector(
      ".last.total#totalCarbs" + table.id.charAt(table.id.length - 1)
    );
    var totalFatsCell = table.querySelector(
      ".last.total#totalFats" + table.id.charAt(table.id.length - 1)
    );

    totalGramsCell.textContent = totalGrams.toFixed(2);
    totalCalsCell.textContent = totalCals.toFixed(2);
    totalProteinsCell.textContent = totalProteins.toFixed(2);
    totalCarbsCell.textContent = totalCarbs.toFixed(2);
    totalFatsCell.textContent = totalFats.toFixed(2);

    var dailyNormCals = resOfCalcGlobal;
    var dailyNormProteins = (0.3 * dailyNormCals) / 4;
    var dailyNormFats = (0.3 * dailyNormCals) / 9;
    var dailyNormCarbs = (0.4 * dailyNormCals) / 4;

    totalCalsCell.style.color = totalCals > dailyNormCals ? "red" : "white";
    totalProteinsCell.style.color =
      totalProteins > dailyNormProteins ? "red" : "white";
    totalCarbsCell.style.color = totalCarbs > dailyNormCarbs ? "red" : "white";
    totalFatsCell.style.color = totalFats > dailyNormFats ? "red" : "white";

    addTooltip(totalGramsCell, "Total grams");
    addTooltip(totalCalsCell, "Total calories");
    addTooltip(totalProteinsCell, "Total proteins");
    addTooltip(totalCarbsCell, "Total carbs");
    addTooltip(totalFatsCell, "Total fats");
  }
  function addTooltip(element, message) {
    if (element.style.color === "red") {
      element.setAttribute("title", "Reduce the amount of " + message);
    } else {
      element.removeAttribute("title");
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    displayTotalValuesForAllTables();
    initializeTableListeners();
  });

  function displayTotalValuesForAllTables() {
    var totalValues = {
      totalGrams: 0,
      totalCals: 0,
      totalProteins: 0,
      totalCarbs: 0,
      totalFats: 0,
    };

    for (let i = 1; i <= 3; i++) {
      var table = document.getElementById("mealTable" + i);

      var totalGramsCell = table.querySelector(".last.total#totalGrams" + i);
      var totalCalsCell = table.querySelector(".last.total#totalCals" + i);
      var totalProteinsCell = table.querySelector(
        ".last.total#totalProteins" + i
      );
      var totalCarbsCell = table.querySelector(".last.total#totalCarbs" + i);
      var totalFatsCell = table.querySelector(".last.total#totalFats" + i);

      totalValues.totalGrams += parseFloat(totalGramsCell?.textContent) || 0;
      totalValues.totalCals += parseFloat(totalCalsCell?.textContent) || 0;
      totalValues.totalProteins +=
        parseFloat(totalProteinsCell?.textContent) || 0;
      totalValues.totalCarbs += parseFloat(totalCarbsCell?.textContent) || 0;
      totalValues.totalFats += parseFloat(totalFatsCell?.textContent) || 0;
    }

    var totalContainer = document.getElementById("totalContainer");

    if (totalContainer) {
      totalContainer.innerHTML =
        "<h2 class='total_h'>Total Values for All Tables</h2>" +
        "<p class='total_par'>Total Grams: " +
        totalValues.totalGrams.toFixed(2) +
        "</p>" +
        "<p class='total_par'>Total Calories: " +
        totalValues.totalCals.toFixed(2) +
        "</p>" +
        "<p class='total_par'>Total Proteins: " +
        totalValues.totalProteins.toFixed(2) +
        "</p>" +
        "<p class='total_par'>Total Carbs: " +
        totalValues.totalCarbs.toFixed(2) +
        "</p>" +
        "<p class='total_par'>Total Fats: " +
        totalValues.totalFats.toFixed(2) +
        "</p>";

      applyColorCoding(totalContainer, totalValues);
    }
  }

  function applyColorCoding(container, values) {
    var dailyNormCals = resOfCalcGlobal;
    var dailyNormProteins = (0.3 * dailyNormCals) / 4;
    var dailyNormFats = (0.3 * dailyNormCals) / 9;
    var dailyNormCarbs = (0.4 * dailyNormCals) / 4;
    console.log(values);
    const dailyNorm = {
      totalGrams: values.grams, // Example norm value
      totalCals: dailyNormCals, // Example norm value
      totalProteins: dailyNormProteins, // Example norm value
      totalCarbs: dailyNormCarbs, // Example norm value
      totalFats: dailyNormFats, // Example norm value
    };

    const ranges = {
      high: 50,
      mid: 20,
    };

    const colors = {
      high: "red",
      mid: "green",
      low: "orange",
    };


    const totalGramsElement = container.querySelector(
      ".total_par:nth-child(2)"
    );
    const totalCalsElement = container.querySelector(".total_par:nth-child(3)");
    const totalProteinsElement = container.querySelector(
      ".total_par:nth-child(4)"
    );
    const totalCarbsElement = container.querySelector(
      ".total_par:nth-child(5)"
    );
    const totalFatsElement = container.querySelector(".total_par:nth-child(6)");

    if (totalGramsElement) {
      totalGramsElement.style.color = getColor(
        values.totalGrams,
        dailyNorm.totalGrams,
        ranges,
        colors
      );
    } else {
      console.error("totalGramsElement not found");
    }

    if (totalCalsElement) {
      totalCalsElement.style.color = getColor(
        values.totalCals,
        dailyNorm.totalCals,
        ranges,
        colors
      );
    } else {
      console.error("totalCalsElement not found");
    }

    if (totalProteinsElement) {
      totalProteinsElement.style.color = getColor(
        values.totalProteins,
        dailyNorm.totalProteins,
        ranges,
        colors
      );
    } else {
      console.error("totalProteinsElement not found");
    }

    if (totalCarbsElement) {
      totalCarbsElement.style.color = getColor(
        values.totalCarbs,
        dailyNorm.totalCarbs,
        ranges,
        colors
      );
    } else {
      console.error("totalCarbsElement not found");
    }

    if (totalFatsElement) {
      totalFatsElement.style.color = getColor(
        values.totalFats,
        dailyNorm.totalFats,
        ranges,
        colors
      );
    } else {
      console.error("totalFatsElement not found");
    }
  }

  function getColor(value, norm, ranges, colors) {
    if (value > norm) {
      return colors.high;
    } else if (value >= norm - ranges.mid && value <= norm + ranges.mid) {
      return colors.mid;
    } else if (value < norm - ranges.high) {
      return colors.low;
    } else {
      return "white";
    }
  }

  function updateTotalValuesForAllTables(totalValues) {
    // Update total values for each table
    for (let i = 1; i <= 3; i++) {
      var table = document.getElementById("mealTable" + i);
      updateTotalValues(table);
    }

    // Display total values for all tables
    displayTotalValuesForAllTables();
    // console.log("Total values for all tables updated successfully!");
  }

  function getProductByName(name) {
    return products.find(function (product) {
      return product.name === name;
    });
  }

  function getRecipeByName(name) {
    return recipes.find(function (recipe) {
      return recipe.name === name;
    });
  }
  var saveToPdfButton = document.querySelector(".second-section__buttonLast");
  if (saveToPdfButton) {
    saveToPdfButton.addEventListener("click", saveTablesToPdf);
  }

  function saveTablesToPdf() {
    var pdf = new jsPDF();

    function getTableContent(tableId) {
      var content = [];
      var table = document.getElementById(tableId);

      if (table) {
        var rows = table.querySelectorAll("tr");

        rows.forEach(function (row) {
          var rowData = [];
          var cells = row.cells;

          for (var i = 0; i < cells.length; i++) {
            var input = cells[i].querySelector(".editable-grams");
            if (input) {
              rowData.push(input.value.trim());
            } else {
              rowData.push(cells[i].textContent.trim());
            }
          }

          content.push(rowData);
        });
      }

      return content;
    }

    function addTableToPdf(tableId, startX, startY) {
      var tableContent = getTableContent(tableId);

      var cellWidth = 30;
      var cellHeight = 10;

      for (var i = 0; i < tableContent.length; i++) {
        for (var j = 0; j < tableContent[i].length; j++) {
          if (i === 0) {
            pdf.text(startX + j * cellWidth, startY, tableContent[i][j]);
          } else {
            pdf.text(
              startX + (j + 1) * cellWidth,
              startY + i * cellHeight,
              tableContent[i][j]
            );
          }
        }
      }
    }

    addTableToPdf("mealTable1", 10, 10);
    pdf.addPage();

    addTableToPdf("mealTable2", 10, 10);
    pdf.addPage();

    addTableToPdf("mealTable3", 10, 10);

    pdf.save("mealTables.pdf");
  }

  $(document).ready(function () {
    $('input[name="availability"]').change(function () {
      restoreTableValues();
      displayTotalValuesForAllTables();
    });

    $(".radio-button2").click(function () {
      restoreTableValues();
      displayTotalValuesForAllTables();
    });

    function restoreTableValues() {
      $(".second-section__table").each(function () {
        var table = $(this);

        table.find("tbody tr:gt(0)").each(function () {
          var row = $(this);

          var gramsInput = row.find("input.editable-grams");

          if (gramsInput.length > 0) {
            gramsInput.val("");

            var cells = row.find("td:not(.last)");

            cells.text("");
          }
          row
            .find("td.foo")
            .html('<input type="text" class="editable-grams"/>');
        });

        table
          .find(".last.total")
          .siblings()
          .not(":first-child")
          .each(function () {
            $(this).text("0");

            $(this).css("color", "white");
          });
      });
    }
  });
});

$(document).ready(function () {
  $(".second-section__t").hide();
  $(".week").hide();
  $("#totalContainer").hide();
  $(".second-section__buttonLast").hide();

  $("#calculateButton").click(function () {
    if (resOfCalcGlobal > 0) {
      // Если результат не равен нулю, показываем вторую секцию
      $(".second-section__t").show();
      $(".week").show();
      $("#totalContainer").show();
      $(".second-section__buttonLast").show();
    }
  });
});

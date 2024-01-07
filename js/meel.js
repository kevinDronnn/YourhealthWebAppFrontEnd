$(document).ready(function () {
  var lastSelectedLabel = null;

  $(".radio-button").click(function () {
    var groupName = $(this).prev().attr("name");

    // Возвращаем цвет предыдущему выбранному лейблу в текущей группе
    if (
      lastSelectedLabel !== null &&
      lastSelectedLabel.prev().attr("name") === groupName
    ) {
      lastSelectedLabel.removeClass("selected-label");
    }

    // Устанавливаем цвет для текущего выбранного лейбла
    $(this).addClass("selected-label");

    // Сохраняем ссылку на текущий выбранный лейбл
    lastSelectedLabel = $(this);

    // Снимаем выбор с радиокнопки, чтобы можно было выбирать одинаковые значения второй раз
    $(this).prev().prop("checked", true);
  });
});

$(document).ready(function () {
  var lastSelectedLabel2 = null;

  $(".radio-button2").click(function () {
    var groupName = $(this).prev().attr("name");
    var selectedValue = $(this).prev().val();

    // Возвращаем цвет предыдущему выбранному лейблу в текущей группе
    if (
      lastSelectedLabel2 !== null &&
      lastSelectedLabel2.prev().attr("name") === groupName
    ) {
      lastSelectedLabel2.removeClass("selected-label2");
    }

    // Устанавливаем цвет для текущего выбранного лейбла
    $(this).addClass("selected-label2");

    // Сохраняем ссылку на текущий выбранный лейбл
    lastSelectedLabel2 = $(this);

    // Снимаем выбор с радиокнопки, чтобы можно было выбирать одинаковые значения второй раз
    $(this).prev().prop("checked", true);
  });
});

// Define a function that encapsulates the calculation logic
function calculateAndOutputResult() {
  // Retrieve values
  var weight = parseFloat($(".input-text:eq(1)").val());
  var height = parseFloat($(".input-text:eq(0)").val());
  var age = parseInt($(".input-text:eq(2)").val(), 10);
  var activityLevel = parseFloat(
    $(".second-section__select").val().replace(",", ".")
  ).toFixed(2);
  var gender = $("input[name='gender']:checked").val();
  var goal = $("input[name='goal']:checked").val();

  console.log("Result of calculation:", weight);
  console.log("Result of calculation:", height);
  console.log("Result of calculation:", age);
  console.log("Result of calculation:", activityLevel);
  console.log("Result of calculation:", gender);

  // Perform calculation
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

  // Output result to console
  console.log("Result of calculation:", result);
  return result;
}

document.addEventListener("DOMContentLoaded", function () {
  var selectedCell;
  var products;

  // Fetch products and update the global array
  fetch("http://localhost:8080/api/products")
    .then((response) => response.json())
    .then((loadedProducts) => {
      products = loadedProducts;
    })
    .catch((error) => console.error("Error loading products:", error));

  // Loop through each table (1, 2, and 3)
  for (let i = 1; i <= 3; i++) {
    initializeTableListeners(i);
  }

  // Create a container for displaying total values for all tables
  var totalContainer = document.createElement("div");
  totalContainer.id = "totalContainer";
  totalContainer.innerHTML = "<h2>Total Values for All Tables</h2>";
  totalContainer.style.color = "white";
  totalContainer.style.textAlign = "center";
  totalContainer.style.position = "relative";
  totalContainer.style.left = "100px";

  document.body.appendChild(totalContainer);

  function initializeTableListeners(tableIndex) {
    var tableId = "mealTable" + tableIndex;
    var modalId = "myModal" + tableIndex;
    var modalContentId = "modalContent" + tableIndex;

    var table = document.getElementById(tableId);

    // Add click event listener for the entire table
    table.addEventListener("click", function (event) {
      var targetCell = event.target;

      // Check if the clicked element is a cell with the "food" class
      if (targetCell.classList.contains("food")) {
        selectedCell = targetCell;

        // Load products from the server
        // Use the products array loaded globally
        var modalContent = document.getElementById(modalContentId);
        if (modalContent) {
          modalContent.innerHTML = ""; // Clear the content

          products.forEach(function (product) {
            var button = document.createElement("button");
            button.classList.add("buttonModal");
            button.textContent = product.name;

            // Add an event listener for the button
            button.addEventListener("click", function () {
              if (selectedCell) {
                var row = selectedCell.closest("tr");

                // Update the content of the "Grams" cell
                var gramsInput = row.querySelector(".editable-grams");
                gramsInput.value = product.grams; // Update the value from the product data

                // Update the content of other cells as before
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

                // Recalculate and update total values in the last cell of each column
                updateTotalValues(table);
                // Update total KBZHU for all tables
                // updateTotalKBZHU();
              }

              // Close the modal window
              document.getElementById(modalId).style.display = "none";
            });

            modalContent.appendChild(button);
          });

          // Open the modal window
          document.getElementById(modalId).style.display = "block";
        } else {
          console.error(modalContentId + " element not found");
        }
      }
    });

    // Add input event listener for editable-grams inputs
    table.addEventListener("input", function (event) {
      var targetInput = event.target;

      // Check if the edited input is a part of the "editable-grams" class
      if (targetInput.classList.contains("editable-grams")) {
        // Check if products array is available
        if (!products) {
          console.error("Products array not loaded");
          return;
        }

        // Get the row and product associated with the edited input
        var row = targetInput.closest("tr");
        var product = getProductByName(row.cells[0].textContent);

        // Update the content of other cells as before
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

        // Recalculate and update total values in the last cell of each column
        updateTotalValues(table);
        // Update total KBZHU for all tables
        // updateTotalKBZHU();
      }
    });

    // Add click event listener to close the modal when the "×" button is clicked
    var closeButton = document.querySelector("#" + modalId + " .close");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        document.getElementById(modalId).style.display = "none";
      });
    }

    // Add click event listener to close the modal when clicking outside of it
    var modal = document.getElementById(modalId);
    var modalContent = modal.querySelector(".modal-content");
    if (modalContent) {
      modalContent.addEventListener("click", function (event) {
        if (event.target === modalContent) {
          modal.style.display = "none";
        }
      });
    }

    // Add keydown event listener to close the modal on "Escape" key press
    window.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        document.getElementById(modalId).style.display = "none";
      }
    });
  }

  function updateTotalValues(table) {
    console.log("Updating total values for table:", table.id);
    var rows = table.querySelectorAll("tr:not(:first-child):not(:last-child)");

    // Initialize sum variables for each column
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

    // Reference to the total cells
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

    // Update total values
    totalGramsCell.textContent = totalGrams.toFixed(2);
    totalCalsCell.textContent = totalCals.toFixed(2);
    totalProteinsCell.textContent = totalProteins.toFixed(2);
    totalCarbsCell.textContent = totalCarbs.toFixed(2);
    totalFatsCell.textContent = totalFats.toFixed(2);

    // Set color to red if values exceed the specified daily norms
    var dailyNormCals = result;
    var dailyNormProteins = (0.3 * dailyNormCals) / 4;
    var dailyNormFats = (0.3 * dailyNormCals) / 9;
    var dailyNormCarbs = (0.4 * dailyNormCals) / 4;

    totalCalsCell.style.color = totalCals > dailyNormCals ? "red" : "white";
    totalProteinsCell.style.color =
      totalProteins > dailyNormProteins ? "red" : "white";
    totalCarbsCell.style.color = totalCarbs > dailyNormCarbs ? "red" : "white";
    totalFatsCell.style.color = totalFats > dailyNormFats ? "red" : "white";

    // Add tooltips to red total values
    addTooltip(totalGramsCell, "Total grams");
    addTooltip(totalCalsCell, "Total calories");
    addTooltip(totalProteinsCell, "Total proteins");
    addTooltip(totalCarbsCell, "Total carbs");
    addTooltip(totalFatsCell, "Total fats");
    console.log("Total values updated successfully!");
    // Display total values for all tables in the separate container
    displayTotalValuesForAllTables();
  }

  function addTooltip(element, message) {
    console.log("Adding tooltip to:", element, "with message:", message);
    if (element.style.color === "red") {
      element.setAttribute("title", "Reduce the amount of " + message);
    } else {
      element.removeAttribute("title");
    }
  }

  // Function to display total values for all tables in a separate container
  function displayTotalValuesForAllTables() {
    var totalContainer = document.getElementById("totalContainer");

    if (totalContainer) {
      var totalValues = {
        totalGrams: 0,
        totalCals: 0,
        totalProteins: 0,
        totalCarbs: 0,
        totalFats: 0,
      };

      // Loop through each table (1, 2, and 3)
      for (let i = 1; i <= 3; i++) {
        var table = document.getElementById("mealTable" + i);

        // Reference to the total cells
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

        // Add values to the totalValues object
        totalValues.totalGrams += parseFloat(totalGramsCell.textContent) || 0;
        totalValues.totalCals += parseFloat(totalCalsCell.textContent) || 0;
        totalValues.totalProteins +=
          parseFloat(totalProteinsCell.textContent) || 0;
        totalValues.totalCarbs += parseFloat(totalCarbsCell.textContent) || 0;
        totalValues.totalFats += parseFloat(totalFatsCell.textContent) || 0;
      }
      // Update total values in the separate container
      updateTotalValuesForAllTables(totalValues);
    }
  }

  function updateTotalValuesForAllTables(totalValues) {
    console.log("Updating total values for all tables");
    var totalContainer = document.getElementById("totalContainer");

    if (totalContainer) {
      // Update total values in the separate container
      totalContainer.innerHTML =
        "<h2 class='total_h'>Total Values for All Tables</h2>" +
        "<p class='total_par'>Total Grams: <span style='color: " +
        getColor(totalValues.totalGrams, "grams") +
        "'>" +
        totalValues.totalGrams.toFixed(2) +
        "</span></p>" +
        "<p class='total_par'>Total Calories: <span style='color: " +
        getColor(totalValues.totalCals, "calories") +
        "'>" +
        totalValues.totalCals.toFixed(2) +
        "</span></p>" +
        "<p class='total_par'>Total Proteins: <span style='color: " +
        getColor(totalValues.totalProteins, "proteins") +
        "'>" +
        totalValues.totalProteins.toFixed(2) +
        "</span></p>" +
        "<p class='total_par'>Total Carbs: <span style='color: " +
        getColor(totalValues.totalCarbs, "carbs") +
        "'>" +
        totalValues.totalCarbs.toFixed(2) +
        "</span></p>" +
        "<p class='total_par'>Total Fats: <span style='color: " +
        getColor(totalValues.totalFats, "fats") +
        "'>" +
        totalValues.totalFats.toFixed(2) +
        "</span></p>";
    }
    console.log("Total values for all tables updated successfully!");
  }

  function getColor(value, nutrient) {
    console.log("Getting color for value:", value, "and nutrient:", nutrient);
    var dailyNorms = {
      grams: 75,
      calories: result,
      proteins: (0.3 * result) / 4,
      fats: (0.3 * result) / 9,
      carbs: (0.4 * result) / 4,
    };

    var color = value > dailyNorms[nutrient] ? "red" : "white";
    console.log("Color:", color);
    return color;
  }

  function getProductByName(name) {
    return products.find(function (product) {
      return product.name === name;
    });
  }
  // Add click event listener to the "Save to pdf" button
  var saveToPdfButton = document.querySelector(".second-section__buttonLast");
  if (saveToPdfButton) {
    saveToPdfButton.addEventListener("click", saveTablesToPdf);
  }

  function saveTablesToPdf() {
    var pdf = new jsPDF();

    // Function to get table content as an array of arrays
    function getTableContent(tableId) {
      var content = [];
      var table = document.getElementById(tableId);

      if (table) {
        var rows = table.querySelectorAll("tr");

        rows.forEach(function (row) {
          var rowData = [];
          var cells = row.cells;

          for (var i = 0; i < cells.length; i++) {
            // Check if the cell contains an input with the class 'editable-grams'
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

    // Add content from each table
    function addTableToPdf(tableId, startX, startY) {
      var tableContent = getTableContent(tableId);

      var cellWidth = 30; // Adjust this based on your preference
      var cellHeight = 10;

      for (var i = 0; i < tableContent.length; i++) {
        for (var j = 0; j < tableContent[i].length; j++) {
          // If it's the first row, add each cell individually
          if (i === 0) {
            pdf.text(startX + j * cellWidth, startY, tableContent[i][j]);
          } else {
            // For other rows, shift one cell to the right and use the cellHeight for positioning
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

    // Save the PDF
    pdf.save("mealTables.pdf");
  }
  // Ждем загрузки документа
  $(document).ready(function () {
    $('input[name="availability"]').change(function () {
      // Дополнительные действия после восстановления значений
      restoreTableValues();
      displayTotalValuesForAllTables();
    });

    $(".radio-button2").click(function () {
      restoreTableValues();
      displayTotalValuesForAllTables();
    });

    function restoreTableValues() {
      // Для каждой таблицы
      $(".second-section__table").each(function () {
        var table = $(this);

        // Для каждой строки таблицы (кроме первой)
        table.find("tbody tr:gt(0)").each(function () {
          var row = $(this);

          // Находим инпут в текущей строке
          var gramsInput = row.find("input.editable-grams");

          // Проверяем, есть ли у нас инпут
          if (gramsInput.length > 0) {
            // Очищаем значение в инпуте
            gramsInput.val("");

            // Получаем доступ к другим ячейкам в строке
            var cells = row.find("td:not(.last)");

            // Очищаем текст в других ячейках
            cells.text("");
          }
          row
            .find("td.foo")
            .html('<input type="text" class="editable-grams"/>');
        });

        /// Обнуляем значения в ячейке с общими итогами, начиная со второй ячейки
        table
          .find(".last.total")
          .siblings()
          .not(":first-child")
          .each(function () {
            $(this).text("0");
            // Устанавливаем цвет текста на белый
            $(this).css("color", "white");
          });
        // Восстановите исходные классы, чтобы вернуть исходные стили
      });
    }
  });
});
$(document).ready(function () {
  // Спрятать все после кнопки Calculate
  $(".second-section__t").hide();
  $(".week").hide();
  $("#totalContainer").hide();
  $(".second-section__buttonLast").hide();

  // Показать содержимое после нажатия кнопки Calculate
  $("#calculateButton").click(function () {
    $(".second-section__t").show();
    $(".week").show();
    $("#totalContainer").show();
    $(".second-section__buttonLast").show();
  });
});

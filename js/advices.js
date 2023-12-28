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
  const paragraph = document.createElement("p");
  const deleteButton = document.createElement("button");

  child_div.classList.add("container");
  child_div.classList.add("second-section__container");
  child_div2.classList.add("second-section__advice-box");
  child_div3.classList.add("second-section__advice-item");
  child_div3.classList.add("advice-item");
  title.classList.add("advice-item__title");
  paragraph.classList.add("advice-item__text");
  deleteButton.classList.add("main-section__buttons-delete");

  title.innerText = item.title;
  paragraph.innerText = item.description;
  deleteButton.innerText = "Delete";

  child_div3.append(title, paragraph, deleteButton);
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
  modal.style.display = "block";
});

closeModalButton.addEventListener("click", () => {
  modal.style.display = "none";
});

submitButton.addEventListener("click", async () => {
  const titleInput = document.getElementById("titleInput").value;
  const descriptionInput = document.getElementById("descriptionInput").value;

  if (titleInput && descriptionInput) {
    await fetch("http://localhost:8080/api/advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titleInput,
        description: descriptionInput,
      }),
    });

    modal.style.display = "none";
    await updateAdvices();
  }
});

renderAdvices();

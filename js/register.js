// Get reference to the form element
const form = document.getElementById("signup-form");

// Add event listener for form submission
form.addEventListener("submit", function (event) {
  // Prevent default form submission behavior
  event.preventDefault();

  // Extract values from form fields
  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Construct request body
  const requestBody = {
    email: email,
    name: username,
    password: password,
  };

  // Make fetch request
  fetch("http://localhost:8080/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Handle successful response
      console.log("Success:", data);
      window.location.href = "loginPage.html";
    })
    .catch((error) => {
      // Handle error
      console.error("Error:", error);
    });
});

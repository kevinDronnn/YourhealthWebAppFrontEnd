document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Extract username and password from the form
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Prepare the request body
    const requestBody = {
      name: username,
      password: password,
    };

    // Send the fetch request to login endpoint
    fetch("http://localhost:8080/login", {
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
        // Store the JWT token in localStorage
        localStorage.setItem("token", data.token);

        // Redirect to home page or do other actions as needed
        window.location.href = "Home page.html";
      })
      .catch((error) => {
        // Handle errors
        console.error("There was a problem with the fetch operation:", error);
      });
  });
});

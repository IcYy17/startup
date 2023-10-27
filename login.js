const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", login);

function login() {
  const nameEl = document.querySelector("#name");
  localStorage.setItem("userName", nameEl.value);
  window.location.href = "shop.html";
}


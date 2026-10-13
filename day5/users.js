
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

// Store all users received from the API.
let users = [];

// Draw the users passed into this function.
function renderUsers(list) {
  usersList.replaceChildren();

  list.forEach((user) => {
    const li = document.createElement("li");

    const name = document.createElement("h2");
    name.textContent = user.name;

    const email = document.createElement("p");
    email.textContent = `Email: ${user.email}`;

    const city = document.createElement("p");
    city.textContent = `City: ${user.address.city}`;

    const company = document.createElement("p");
    company.textContent = `Company: ${user.company.name}`;

    li.append(name, email, city, company);
    usersList.appendChild(li);
  });
}

// Fetch users from the API.
async function loadUsers() {
  statusText.textContent = "Loading users...";
  loadButton.disabled = true;
  usersList.replaceChildren();

  try {
    const response = await fetch(API_URL);

    // fetch does not automatically reject HTTP 404 or 500 responses.
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();

    users = data;

    // Clear the filter after a fresh load.
    filterInput.value = "";

    renderUsers(users);

    statusText.textContent = `Loaded ${users.length} users.`;
  } catch (error) {
    users = [];
    statusText.textContent =
      "Could not load users. Please try again.";

    console.error("Error loading users:", error);
  } finally {
    loadButton.disabled = false;
  }
}

// Load users when the button is clicked.
loadButton.addEventListener("click", loadUsers);

// Filter the stored users as the user types.
// This does not make another API request.
filterInput.addEventListener("input", () => {
  const searchTerm = filterInput.value.trim().toLowerCase();

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm)
  );

  renderUsers(filteredUsers);

  if (users.length === 0) {
    statusText.textContent = "Load users first to filter them.";
  } else if (filteredUsers.length === 0) {
    statusText.textContent = "No users match your filter.";
  } else {
    statusText.textContent =
      `Showing ${filteredUsers.length} of ${users.length} users.`;
  }
});

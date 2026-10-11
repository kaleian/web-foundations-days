
// 1. Select the elements we need
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");

const STORAGE_KEY = "quicknotes";

// 2. Load saved notes or start with an empty array
let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);

  try {
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not load saved notes:", error);
    return [];
  }
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// 3. Display notes on the page
function render() {
  list.innerHTML = "";

  notes.forEach((note) => {
    const li = document.createElement("li");
    li.classList.add("note");

    const text = document.createElement("span");
    text.textContent = note.text;

    const del = document.createElement("button");
    del.textContent = "Delete";
    del.classList.add("delete-btn");

    del.addEventListener("click", () => {
      deleteNote(note.id);
    });

    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });

  count.textContent =
    notes.length === 1
      ? "You have 1 note."
      : `You have ${notes.length} notes.`;
}

// 4. Add a note
function addNote(text) {
  notes.push({
    id: Date.now(),
    text: text
  });

  saveNotes();
  render();
}

// 5. Delete a note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);

  saveNotes();
  render();
}

// 6. Handle form submission
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    return;
  }

  addNote(text);

  input.value = "";
  input.focus();
});

// 7. Render notes when the page loads
render();

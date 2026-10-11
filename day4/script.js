
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

const DRAFT_KEY = "notes-toolkit-draft";
const THEME_KEY = "notes-toolkit-theme";

// Update the character count, word count, and warning styles.
function updateCounts() {
  const text = noteText.value;
  const characters = text.length;

  // Ignore extra spaces and count only actual words.
  const trimmedText = text.trim();
  const words = trimmedText === ""
    ? 0
    : trimmedText.split(/\s+/).length;

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Reset previous warning classes before applying new ones.
  charCount.classList.remove("warning", "over");

  if (characters > 200) {
    charCount.classList.add("over");
  } else if (characters > 180) {
    charCount.classList.add("warning");
  }
}

// Save the current draft.
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, noteText.value);
}

// Clear the text and remove the saved draft.
function clearNote() {
  noteText.value = "";
  localStorage.removeItem(DRAFT_KEY);
  updateCounts();
}

// Apply the selected theme and update the button label.
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

// Restore saved content and preferences when the page loads.
function initializePage() {
  const savedDraft = localStorage.getItem(DRAFT_KEY);
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedDraft !== null) {
    noteText.value = savedDraft;
  }

  applyTheme(savedTheme === "dark");
  updateCounts();
}

// Update counters and save the draft whenever the user types.
noteText.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

// Clear the note when the Clear button is clicked.
clearBtn.addEventListener("click", clearNote);

// Clear the note when Escape is pressed inside the textarea.
noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearNote();
  }
});

// Toggle the theme and remember the user's choice.
themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");

  applyTheme(isDark);
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// Run after the HTML has loaded.
initializePage();

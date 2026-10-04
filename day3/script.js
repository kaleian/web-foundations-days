let notes = [
{ id: 1, text: "Buy milk and bread", category: "personal" },
{ id: 2, text: "Finish the Day 3 assignment", category: "study" },
{ id: 3, text: "Email the project report to Grace", category: "work" },
{ id: 4, text: "Revise JavaScript arrays", category: "study" },
{ id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
const searchWord = word.toLowerCase();

return notes.filter(note =>
note.text.toLowerCase().includes(searchWord)
);
}

function longestNote() {
if (notes.length === 0) {
return null;
}

let longest = notes[0];

for (const note of notes) {
if (note.text.length > longest.text.length) {
longest = note;
}
}

return longest;
}

function countByCategory() {
const counts = {};

for (const note of notes) {
if (counts[note.category]) {
counts[note.category]++;
} else {
counts[note.category] = 1;
}
}

return counts;
}

function getSummary() {
const counts = countByCategory();
const total = notes.length;
const noteWord = total === 1 ? "note" : "notes";

return `${total} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

function isDuplicate(text) {
const cleanText = text.trim().toLowerCase();

return notes.some(
note => note.text.trim().toLowerCase() === cleanText
);
}

function addNote(text, category) {
const cleanText = text.trim();
const validCategories = ["personal", "work", "study"];

if (cleanText.length < 1 || cleanText.length > 200) {
console.log("Note was not added: text must be 1–200 characters.");
return false;
}

if (isDuplicate(cleanText)) {
console.log("Note was not added: a note with the same text already exists.");
return false;
}

if (!validCategories.includes(category)) {
console.log("Note was not added: category must be personal, work, or study.");
return false;
}

const newNote = {
id: notes.length + 1,
text: cleanText,
category: category,
};

notes.push(newNote);

console.log("Note added successfully.");
return true;
}

/* Test searchNotes */

console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("python"));
// Expected: []

/* Test longestNote */

console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

const savedNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null

notes = savedNotes;

/* Test countByCategory */

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

console.log(notes.filter(note => note.category === "personal").length);
// Expected: 2

/* Test getSummary */

console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

notes = [notes[0]];

console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."

notes = savedNotes;

/* Test isDuplicate */

console.log(isDuplicate("  BUY MILK AND BREAD  "));
// Expected: true

console.log(isDuplicate("Buy eggs"));
// Expected: false

/* Test addNote */

console.log(addNote("Learn JavaScript functions", "study"));
// Expected: true

console.log(addNote("  Buy milk and bread  ", "personal"));
// Expected: false

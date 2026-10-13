
# Library Books REST API Design

## Overview

The Library Books API allows clients to retrieve, create, update, and
delete books, as well as find books written by a particular author.

Base URL: `https://api.example.com`

Each book has an ID, title, author, publication year, and ISBN.

## 1. List All Books

- **Method:** GET
- **Path:** `/books`
- **Description:** Returns a list of all books.
- **Success status:** `200 OK`
- **Example response:**

```json
[
  {
    "id": 1,
    "title": "Things Fall Apart",
    "author": "Chinua Achebe",
    "year": 1958,
    "isbn": "9780385474542"
  }
]
```

## 2. Get One Book

- **Method:** GET
- **Path:** `/books/{bookId}`
- **Description:** Returns the details of one book identified by its ID.
- **Success status:** `200 OK`
- **Example request:** `GET /books/1`

## 3. Create a Book

- **Method:** POST
- **Path:** `/books`
- **Description:** Creates a new book using the supplied book details.
- **Success status:** `201 Created`
- **Example request body:**

```json
{
  "title": "The River Between",
  "author": "Ngugi wa Thiong'o",
  "year": 1965,
  "isbn": "9780435905484"
}
```

## 4. Update a Book

- **Method:** PUT
- **Path:** `/books/{bookId}`
- **Description:** Replaces the details of an existing book.
- **Success status:** `200 OK`
- **Example request:** `PUT /books/1`
- **Example request body:**

```json
{
  "title": "Things Fall Apart",
  "author": "Chinua Achebe",
  "year": 1958,
  "isbn": "9780385474542"
}
```

## 5. Delete a Book

- **Method:** DELETE
- **Path:** `/books/{bookId}`
- **Description:** Deletes the book identified by its ID.
- **Success status:** `204 No Content`
- **Example request:** `DELETE /books/1`

## 6. List Books by Author

- **Method:** GET
- **Path:** `/books?author={authorName}`
- **Description:** Returns books written by the specified author.
- **Success status:** `200 OK`
- **Example request:** `GET /books?author=Chinua%20Achebe`

## Error Responses

### 400 Bad Request

- **Description:** The request contains invalid or missing data.
- **Example:** Creating a book without a required title.
- **Example response:**

```json
{
  "error": "Title is required."
}
```

### 404 Not Found

- **Description:** The requested resource does not exist.
- **Example:** Requesting `GET /books/9999` when no book has that ID.
- **Example response:**

```json
{
  "error": "Book not found."
}
```

const express = require('express');

let books = require("../booksdb.js");
let users = require("../usersdb.js");

const public_users = express.Router();

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  return userswithsamename.length > 0;
};

// Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get books by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const result = Object.values(books).filter(book =>
    book.author.toLowerCase() === author
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get books by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const result = Object.values(books).filter(book =>
    book.title.toLowerCase() === title
  );

  if (result.length > 0) {
    return res.status(200).json(result);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Register new user
public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({ message: "User successfully registered" });
});

// Async/Await: Get all books
public_users.get('/async/books', async function (req, res) {
  try {
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const result = await getBooks();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Promise: Search book by ISBN
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then(result => res.status(200).json(result))
    .catch(error => res.status(404).json({ message: error }));
});

// Promise: Search books by author
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const result = Object.values(books).filter(book =>
      book.author.toLowerCase() === author
    );

    if (result.length > 0) {
      resolve(result);
    } else {
      reject("No books found by this author");
    }
  });

  getBooksByAuthor
    .then(result => res.status(200).json(result))
    .catch(error => res.status(404).json({ message: error }));
});

// Async/Await: Search books by title
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(book =>
          book.title.toLowerCase() === title
        );

        if (result.length > 0) {
          resolve(result);
        } else {
          reject("No books found with this title");
        }
      });
    };

    const result = await getBooksByTitle();
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;

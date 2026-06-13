const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let users = require("./usersdb.js");

const public_users = express.Router();

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  return userswithsamename.length > 0;
};

// Task 2: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 3: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Task 4: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();

  const result = Object.values(books).filter((book) => {
    return book.author.toLowerCase() === author;
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "No books found by this author" });
});

// Task 5: Get book details based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const result = Object.values(books).filter((book) => {
    return book.title.toLowerCase() === title;
  });

  if (result.length > 0) {
    return res.status(200).json(result);
  }

  return res.status(404).json({ message: "No books found with this title" });
});

// Task 6: Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Task 7: Register new user
public_users.post('/register', function (req, res) {
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

/*
  Task 11 / Async-Axios Implementations
  These routes use callback, Promises, and async/await with Axios.
*/

// Retrieve all books using callback with Axios
public_users.get('/async/books', function (req, res) {
  const getAllBooks = (callback) => {
    axios.get('http://localhost:5000/')
      .then((response) => {
        callback(null, response.data);
      })
      .catch((error) => {
        callback(error, null);
      });
  };

  getAllBooks((error, data) => {
    if (error) {
      return res.status(500).json({ message: "Error retrieving books" });
    }

    return res.status(200).json(data);
  });
});

// Search book by ISBN using Promise with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/')
      .then((response) => {
        const allBooks = response.data;

        if (allBooks[isbn]) {
          resolve(allBooks[isbn]);
        } else {
          reject("Book not found");
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Search books by author using async/await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author.toLowerCase();

  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    const result = Object.values(allBooks).filter((book) => {
      return book.author.toLowerCase() === author;
    });

    if (result.length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({ message: "No books found by this author" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by author" });
  }
});

// Search books by title using async/await with Axios
public_users.get('/async/title/:title', async function (req, res) {
  const title = req.params.title.toLowerCase();

  try {
    const response = await axios.get('http://localhost:5000/');
    const allBooks = response.data;

    const result = Object.values(allBooks).filter((book) => {
      return book.title.toLowerCase() === title;
    });

    if (result.length > 0) {
      return res.status(200).json(result);
    }

    return res.status(404).json({ message: "No books found with this title" });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books by title" });
  }
});

module.exports.general = public_users;

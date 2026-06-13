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

// Get all books using Promise
public_users.get('/', function (req, res) {
  const getAllBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  });

  getAllBooks
    .then((bookList) => {
      return res.status(200).json(bookList);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
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

// Get book details based on title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
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

// Get book reviews
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

// Register new user
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

module.exports.general = public_users;

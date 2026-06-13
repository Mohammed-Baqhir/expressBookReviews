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
module.exports.general = public_users;

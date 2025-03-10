import mongoose from "mongoose";
import { Book } from "../models/bookModel.js";

export async function getBooks(req, res) {
  try {
    const books = await Book.find();
    res.json({
      count: books.length,
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function createBook(req, res) {
  if (
    !req.body ||
    !req.body.title ||
    !req.body.author ||
    !req.body.publishYear
  ) {
    return res.status(400).json({ message: "Please provide all fields" });
  }
  const { title, author, publishYear } = req.body;
  const book = new Book({
    title,
    author,
    publishYear,
  });
  try {
    const createdBook = await book.save();
    res.status(201).json(createdBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getBookById(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Please provide id" });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid  ID format" });
    }

    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result) return res.status(404).json({ message: "Book not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function updateBook(req, res) {
  try {
    const { id } = req.params;

    const body = req.body;

    if (!id) return res.status(400).json({ message: "Please provide id" });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid  ID format" });

    const book = await Book.findById(id);
    book.title = body.title;
    book.author = body.author;
    book.publishYear = body.publishYear;
    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deleteBook(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Please provide id" });

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid  ID format" });

    const result = await Book.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

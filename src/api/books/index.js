import Express from "express";
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBookSchema, triggerBadRequest } from "./validation.js";
import { getBooks, writeBooks } from "../../lib/fs-tools.js";

const booksRouter = Express.Router();

const aRandomMiddleware = (req, res, next) => {
  console.log("I am a Random middleware!");
  next();
};

booksRouter.post(
  "/",
  checkBookSchema,
  triggerBadRequest,
  async (req, res, next) => {
    const books = await getBooks();
    const newBook = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };
    books.push(newBook);
    await writeBooks(books);
    res.status(201).send({ id: newBook.id });

    res.send();
  }
);

booksRouter.get("/", aRandomMiddleware, async (req, res, next) => {
  const books = await getBooks();
  if (req.query && req.query.category) {
    const filteredBooks = books.filter(
      (book) => book.category === req.query.category
    );
    res.send(filteredBooks);
  }
  res.send(books);
});

booksRouter.get("/:bookId", aRandomMiddleware, async (req, res, next) => {
  try {
    const books = await getBooks();

    const book = books.find((book) => book.id === re.params.bookId);
    if (book) {
      res.send(book);
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

booksRouter.put("/:bookId", async (req, res, next) => {
  try {
    const books = await getBooks();

    const index = books.findIndex((book) => book.id === req.params.bookId);
    if (index !== -1) {
      const oldBook = books[index];
      const updatedBook = { ...oldBook, ...req.body, updatedAt: new Date() };
      books[index] = updatedBook;
      await writeBooks(books);
      res.send(updatedBook);
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

booksRouter.delete("/:bookId", async (req, res, next) => {
  try {
    const books = await getBooks();
    const remainingBooks = books.filter(
      (book) => book.id !== req.params.bookId
    );
    if (books.length !== remainingBooks.length) {
      await writeBooks(remainingBooks);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Book with id ${req.params.bookId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default booksRouter;

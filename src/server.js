import Express from "express";
import listEndpoints from "express-list-endpoints";
import booksRouter from "./api/books/index.js";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,
} from "./api/errorsHandler.js";
import usersRouter from "./api/users/index.js";
import cors from "cors";
import filesRouter from "./api/files/index.js";
import { join } from "path";

const server = Express();
const port = 3001;

const publicFolderPath = join(process.cwd(), "./public");

// ************************** MIDDLEWARES *********************
const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  req.user = "Eleni";
  next();
};

const policeOfficerMiddleware = (req, res, next) => {
  console.log("Hey I am the police officer!");
  if (req.user === "Eleni") {
    next();
  } else {
    res.status(401).send({ message: "I am sorry only Eleni is allowed!" });
  }
};

server.use(Express.static(publicFolderPath));
server.use(cors());
server.use(loggerMiddleware);
server.use(policeOfficerMiddleware);
server.use(Express.json());

// ********************** ENDPOINTS **********************
server.use("/users", usersRouter);
server.use("/books", booksRouter);
server.use("/files", filesRouter);

// ********************** ERROR HANDLERS **********************

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.table(listEndpoints(server));
});

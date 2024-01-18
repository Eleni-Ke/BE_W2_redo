//  ************************** USERS RELATED ENDPONTS **************************

/* ************************** USERS CRUD ENDPONTS **************************

1. CREATE -> POST http://localhost:3001/users (+ body)
2. READ -> GET http://localhost:3001/users (+ optional query params)
3. READ -> GET http://localhost:3001/users/:userId
4. UPDATE -> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE -> DELETE http://localhost:3001/users/:userId
*/

import Express from "express";
import uniqid from "uniqid";
import { getUsers, writeUsers } from "../../lib/fs-tools.js";

const usersRouter = Express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
      id: uniqid(),
    };
    const users = await getUsers();
    users.push(newUser);
    await writeUsers(users);
    res.status(201).send({ id: newUser.id });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await getUsers();
    res.send(users);
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/:userId", async (req, res, next) => {
  try {
    const usersArray = await getUsers();
    const user = usersArray.find((user) => user.id === req.params.userId);
    if (user) {
      res.send(user);
    } else {
      res
        .status(404)
        .send({ message: `User with id ${req.params.userId} not found!` });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.put("/:userId", async (req, res, next) => {
  try {
    const usersArray = await getUsers();
    const index = usersArray.findIndex((user) => user.id === req.params.userId);
    if (index !== -1) {
      const oldUser = usersArray[index];
      const updatedUser = { ...oldUser, ...req.body, updatedAt: new Date() };
      usersArray[index] = updatedUser;
      await writeUsers(usersArray);
      res.send(updatedUser);
    } else {
      res
        .status(404)
        .send({ message: `User with id ${req.params.userId} not found!` });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.delete("/:userId", async (req, res, next) => {
  try {
    const usersArray = await getUsers();
    const remainingUsers = usersArray.filter(
      (user) => user.id !== req.params.userId
    );
    if (remainingUsers.length !== usersArray.length) {
      await writeUsers(remainingUsers);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;

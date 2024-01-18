import Express from "express";
import multer from "multer";
import { saveUsersAvatar } from "../../lib/fs-tools.js";
import { extname } from "path";

const filesRouter = Express.Router();

filesRouter.post(
  "/:userId/single",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.userId + originalFileExtension;
      await saveUsersAvatar(fileName, req.file.buffer);

      res.send({ message: "File uploaded!" });
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.post(
  "/:userId/multiple",
  multer().array(),
  async (req, res, next) => {
    try {
      await Promise.all(
        req.files.map((file) => saveUsersAvatar(file.originalname, file.buffer))
      );
      res.send({ message: "Files uploaded!" });
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;

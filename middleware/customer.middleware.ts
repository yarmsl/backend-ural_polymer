import { NextFunction, Request, Response } from "express";
import multer from "multer";
import {existsSync, mkdirSync} from "fs";

const customerUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.method === "OPTIONS") {
    return next();
  }
  const { user } = req.body;

  const path = 'uploads/customer/';
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path);
    },
    filename: (req, file, cb) => {
      const uniqName = `${file.originalname.slice(0, -4)}_${Date.now()}.svg`;
      cb(null, uniqName);
    },
  });

  const upload = multer({ storage: storage });
  const middleware = upload.single("logo");
  return middleware(req, res, () => {
    try {
      req.body.user = user;
      next();
    } catch (e) {
      next(e);
      return;
    }
  });
};

export default customerUpload;
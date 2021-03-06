import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../../models/User";
import bcrypt from "bcrypt";
import { RoleTypes } from "../../types/types";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/constants";

const token = (id: string, role: RoleTypes): string =>
  jwt.sign({ userId: id, role: role }, JWT_SECRET, {
    expiresIn: "7d",
  });

const signInController = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.mapped();
      res.status(400).json({
        message: err?.email?.msg || err?.password?.msg || "invalid data",
      });
      return;
    }
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "user not found" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "password is incorrect" });
      return;
    }

    res.status(200).json({
      name: user.name,
      token: token(user._id, user.role),
      role: user.role,
      articles: user.articles,
      customers: user.customers,
      presentationFile: user.presentationFile,
      productions: user.productions,
      projects: user.projects,
      steps: user.steps,
      stories: user.stories,
      storyArticles: user.storyArticles,
      tags: user.tags,
      vacancies: user.vacancies,
    });
  } catch (e) {
    res.status(500).json({ message: "signin error" });
    return;
  }
};

export default signInController;

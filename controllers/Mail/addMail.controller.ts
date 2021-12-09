import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User from "../../models/User";
import Mail from "../../models/Mail";
import { sendMail } from "./sendMail";

const addMailController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body.user;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = errors.mapped();
      res.status(400).json({
        message:
          err?.provider?.msg ||
          err?.email?.msg ||
          err?.pass?.msg ||
          err?.feedback.msg ||
          "invalid data",
      });
      return;
    }

    const { provider, email, feedback, pass } = req.body;

    const user = await User.findById(userId);
    if (user) {
      const oldMail = await Mail.find();
      if (Array.isArray(oldMail) && oldMail.length > 0) {
        await Mail.findByIdAndDelete(oldMail[0]._id);
      }

      const newMail = new Mail({
        provider,
        email,
        feedback,
        pass,
      });
      await newMail.save();

      const confirmMessage = {
        from: email,
        to: email,
        subject: "Почтовый адрес успешно добавлен",
        text: "Отпарвлено из панели управления Урал-Полимер",
      };

      const confirmFeedbackMessage = {
        from: email,
        to: feedback,
        subject: "Почтовый адрес для обратной связи успешно добавлен",
        text: "Отпарвлено из панели управления Урал-Полимер",
      };

      await sendMail(provider, email, pass, confirmMessage);

      await sendMail(provider, email, pass, confirmFeedbackMessage);

      res
        .status(201)
        .json({ message: "Ожидайте подтверждения на указанных адресах" });
      return;
    } else {
      res.status(500).json({ message: "no auth" });
    }
  } catch (e) {
    res.status(500).json({ message: `adding message error ${e}` });
    return;
  }
};

export default addMailController;

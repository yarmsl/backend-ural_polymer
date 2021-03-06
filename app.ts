import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import customerRoutes from "./routes/customer.routes";
import tagRoutes from "./routes/tag.routes";
import projectRoutes from "./routes/projects.routes";
import bannerRoutes from "./routes/banner.routes";
import cors from "cors";
import { DB_HOST, PORT, SCOPE_HOST } from "./config/constants";
import sendmail from "./routes/mail.routes";
import devRoutes from "./routes/dev.routes";
import fileRoutes from "./routes/file.routes";
import articleRoutes from "./routes/article.routes";
import productionRoutes from "./routes/production.routes";
import storyRoutes from "./routes/story.routes";
import storyArticlesRoutes from "./routes/storyArticle.routes";
import vacancyRoutes from "./routes/vacancy.routes";

const corsOptions = {
  origin: SCOPE_HOST,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use("/uploads", express.static("uploads", { maxAge: 1296000000 }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/tag", tagRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/file", fileRoutes);
app.use("/api/mail", sendmail);
app.use("/api/article", articleRoutes);
app.use("/api/production", productionRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/storyarticle", storyArticlesRoutes);
app.use("/api/vacancy", vacancyRoutes);
app.use("/api/dev", devRoutes);
const start = async () => {
  try {
    await mongoose.connect(DB_HOST);
  } catch (e) {
    console.warn("Server error ", e);
    process.exit(1);
  }
};
start();

app.listen(PORT, () => console.log(`Server up port ${PORT}`));

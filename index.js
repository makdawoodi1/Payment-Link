import Stripe from "stripe";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import paymentRoutes from "./routes/paymentRoutes.js"

const prisma = new PrismaClient();
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.use(cookieParser());
app.use(express.json());

app.use("/api/payments", paymentRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

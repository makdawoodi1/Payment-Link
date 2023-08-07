import { Router } from "express";
import { linkGenerate, fetchSessionDetails, createPayment } from "../controllers/paymentController.js";

const paymentRoutes = Router();

paymentRoutes.get("/fetch-session-details", fetchSessionDetails);
paymentRoutes.post("/generate-link", linkGenerate);
paymentRoutes.post("/create-payment", createPayment);

export default paymentRoutes;

import { Router } from "express";
import linkGenerate from "../controllers/linkGenerateController.js";
import fetchSessionDetails from "../controllers/fetchSessionController.js";
import createPayment from "../controllers/paymentController.js";
import confirmPayment from "../controllers/confirmPaymentController.js";

const paymentRoutes = Router();

paymentRoutes.get("/fetch-session-details", fetchSessionDetails);
paymentRoutes.post("/generate-link", linkGenerate);
paymentRoutes.post("/create-payment", createPayment);
paymentRoutes.post("/confirm-payment", confirmPayment)

export default paymentRoutes;

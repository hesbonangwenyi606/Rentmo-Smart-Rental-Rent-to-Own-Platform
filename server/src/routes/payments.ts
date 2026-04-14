import { Router } from "express";
import * as ctrl from "../controllers/payments";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, ctrl.list);
router.post("/mpesa/initiate", authenticate, ctrl.initiateMpesa);
// Safaricom calls this — no auth header, but we validate the body structure
router.post("/mpesa/callback", ctrl.mpesaCallback);
router.get("/mpesa/status/:checkoutRequestId", authenticate, ctrl.queryStatus);
// Dev only: simulate M-Pesa completion
router.post("/simulate/:paymentId", authenticate, ctrl.simulatePayment);
router.post("/record", authenticate, ctrl.recordPayment);
router.get("/receipt/:id", authenticate, ctrl.getReceipt);
router.get("/:id", authenticate, ctrl.getById);

export default router;

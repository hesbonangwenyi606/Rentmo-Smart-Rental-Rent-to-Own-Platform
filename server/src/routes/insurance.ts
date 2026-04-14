import { Router } from "express";
import * as ctrl from "../controllers/insurance";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/plans", ctrl.getPlans);
router.get("/subscription", authenticate, ctrl.getSubscription);
router.post("/subscribe", authenticate, ctrl.subscribe);
router.delete("/subscription", authenticate, ctrl.cancelSubscription);
router.get("/claims", authenticate, ctrl.getClaims);
router.post("/claims", authenticate, ctrl.fileClaim);
router.patch("/claims/:id/status", authenticate, requireAdmin, ctrl.updateClaimStatus);

export default router;

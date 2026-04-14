import { Router } from "express";
import * as ctrl from "../controllers/creditScore";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, ctrl.getMy);
router.post("/recalculate", authenticate, ctrl.recalculate);
router.post("/recalculate/:userId", authenticate, ctrl.recalculate);

export default router;

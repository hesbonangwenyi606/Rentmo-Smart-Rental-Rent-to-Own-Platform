import { Router } from "express";
import * as ctrl from "../controllers/loans";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, ctrl.list);
router.post("/", authenticate, ctrl.apply);
router.get("/:id", authenticate, ctrl.getById);
router.patch("/:id/status", authenticate, requireAdmin, ctrl.updateStatus);

export default router;

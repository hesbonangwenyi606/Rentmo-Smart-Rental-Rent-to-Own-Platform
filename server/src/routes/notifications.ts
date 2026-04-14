import { Router } from "express";
import * as ctrl from "../controllers/notifications";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.get("/", ctrl.list);
router.patch("/read-all", ctrl.markAllRead);
router.patch("/:id/read", ctrl.markRead);

export default router;

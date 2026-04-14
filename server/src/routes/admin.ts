import { Router } from "express";
import * as ctrl from "../controllers/admin";
import { authenticate, requireAdmin } from "../middleware/auth";

const router = Router();

router.use(authenticate, requireAdmin);

router.get("/stats", ctrl.getStats);
router.get("/users", ctrl.getUsers);
router.patch("/users/:id", ctrl.updateUser);
router.get("/payments", ctrl.getAllPayments);
router.get("/loans", ctrl.getAllLoans);
router.get("/claims", ctrl.getAllClaims);

export default router;

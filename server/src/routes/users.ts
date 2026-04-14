import { Router } from "express";
import * as ctrl from "../controllers/users";
import { authenticate, requireLandlord } from "../middleware/auth";

const router = Router();

router.get("/profile", authenticate, ctrl.getProfile);
router.put("/profile", authenticate, ctrl.updateProfile);
router.put("/password", authenticate, ctrl.changePassword);
router.get("/dashboard", authenticate, ctrl.getDashboard);
router.get("/dashboard/landlord", authenticate, requireLandlord, ctrl.getLandlordDashboard);

export default router;

import { Router } from "express";
import * as ctrl from "../controllers/properties";
import { authenticate, requireLandlord } from "../middleware/auth";

const router = Router();

router.get("/", ctrl.list);
router.get("/mine", authenticate, requireLandlord, ctrl.myProperties);
router.get("/:id", ctrl.getById);
router.post("/", authenticate, requireLandlord, ctrl.create);
router.put("/:id", authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.remove);

export default router;

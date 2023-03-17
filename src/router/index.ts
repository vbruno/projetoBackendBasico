import { Router } from "express";

import { userRoutes } from "./route.user";

const router = Router();

router.use("/user", userRoutes);

export { router };

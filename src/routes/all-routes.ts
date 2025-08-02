import { Router } from "express";
import registerRouter from "./auth-routes/register";
import loginRouter from "./auth-routes/login";

const router = Router();

router.use("/register", registerRouter);

router.use("/login", loginRouter);

export default router;
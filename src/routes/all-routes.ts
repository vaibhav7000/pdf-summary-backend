import { Router } from "express";
import registerRouter from "./auth-routes/register";
import loginRouter from "./auth-routes/login";
import applicationRouter from "./application-routes/index";

const router = Router();

router.use("/register", registerRouter);

router.use("/login", loginRouter);

router.use("/summary", applicationRouter);

export default router;
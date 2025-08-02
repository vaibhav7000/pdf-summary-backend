import { Router } from "express";
import registerRouter from "./auth-routes/register";

const router = Router();

router.use("/register", registerRouter);


export default router;
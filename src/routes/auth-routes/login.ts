import { Router } from "express";
import { Next, Req, Res } from "../../utils/types";
import { validateWithOTP, validateWithPassword } from "../../middlewares/login";
import { userCheckerAndToken, userCheckerAndStoreOTP, verifOTPAndToken } from "../../controller/auth-routes/login";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { emailChecker, emailOtpValidator } from "../../middlewares/register";
const router = Router();


router.post("/password", validateWithPassword, userCheckerAndToken, (req: Req, res: Res, next: Next) => {
    res.status(StatusCodes.OK).json({
        phrase: ReasonPhrases.OK,
        msg: "Successfully login",
        token: req["token"]
    })
})

router.post("/otp", validateWithOTP, userCheckerAndStoreOTP, (req: Req, res: Res, next: Next) => {
    res.status(StatusCodes.OK).json({
        phrase: ReasonPhrases.OK,
        msg: "OTP sent successfully"
    })
})

router.post("/verifyotp", emailOtpValidator, verifOTPAndToken, (req: Req, res: Res, next: Next) => {
    res.status(StatusCodes.OK).json({
        phrase: ReasonPhrases.OK,
        msg: "Successfully login",
        token: req["token"]
    })
})

export default router;
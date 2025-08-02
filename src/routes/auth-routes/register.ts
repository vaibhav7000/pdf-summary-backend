import { Router  } from "express";
import { Req, Res, Next } from "../../utils/types";
import { emailChecker, emailValidator, userSchemaValidate } from "../../middlewares/register";
import { storeOTPRedisSendEmail, verifyOtpAndStoreUser } from "../../controller/auth-routes/register";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
const router = Router();


router.post("/", userSchemaValidate, emailChecker, storeOTPRedisSendEmail ,(req: Req, res: Res, next: Next) => {
    res.status(StatusCodes.OK).json({
        phrase: ReasonPhrases.OK,
        msg: "otp send successfully"
    })
})

router.post("/verifyotp", emailValidator, emailChecker, verifyOtpAndStoreUser, (req: Req, res: Res, next: Next) => {
    res.status(StatusCodes.CREATED).json({
        phrase: ReasonPhrases.CREATED,
        msg: "User Created Successfully"
    })
})

export default router;
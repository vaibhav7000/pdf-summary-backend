import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { Next, Req, Res } from "../../utils/types";
import { loginPasswordSchema, loginOTPSchema } from "../../utils/zod";


function validateWithPassword(req: Req, res: Res, next: Next) {
    const {email, password}: {email: string; password: string} = req["body"];

    const result = loginPasswordSchema.safeParse({
        email, password
    })

    if(!result.success) {
        res.status(StatusCodes.LENGTH_REQUIRED).json({
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            issues: result["error"]["issues"],
            name: result["error"]["name"]
        })

        return;
    }

    req["body"] = result["data"];

    next();
}


function validateWithOTP(req: Req, res: Res, next: Next) {
    const { email }: {email: string} = req["body"];

    const result = loginOTPSchema.safeParse({
        email
    })

    if(!result.success) {
        res.status(StatusCodes.LENGTH_REQUIRED).json({
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            issues: result["error"]["issues"],
            name: result["error"]["name"]
        })
        return;
    }

    next();
}

export {
    validateWithOTP, validateWithPassword
}
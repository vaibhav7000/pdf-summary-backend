import { getReasonPhrase, getStatusCode, ReasonPhrases, StatusCodes } from "http-status-codes";
import { Next, Req, Res, User } from "../../utils/types";
import { emailOTPSchema, UserSchema } from "../../utils/zod";
import prismaClient from "../../db";

function userSchemaValidate(req: Req, res: Res, next: Next) {
    const user: User = req["body"];

    const result = UserSchema.safeParse(user);

    if(!result["success"]) {
        res.status(StatusCodes.LENGTH_REQUIRED).json({
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            issues: result["error"]["issues"],
            name: result["error"]["name"]
        })

        return
    }

    next()

    req["body"] = result["data"];
}

async function emailChecker(req: Req, res: Res, next: Next) {
    const {email} : User = req["body"]

    try {
        const response = await prismaClient.user.findUnique({
            where: {
                email
            }, select: {
                firstname: true,
                lastname: true,
                id: true
            }
        })

        if(response) {
            res.status(StatusCodes.CONFLICT).json({
                phrase: ReasonPhrases.CONFLICT,
                msg: "User with this email already exist"
            })

            return;
        }

        next();
    } catch (error) {
        next(error);
    }
}

function emailValidator(req: Req, res: Res, next: Next) {
    const {email, otp}: {email: string; otp: number} = req["body"];

    const result = emailOTPSchema.safeParse({
        email, otp
    });

    if(!result.success) {
        res.status(StatusCodes.LENGTH_REQUIRED).json({
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            issues: result["error"]["issues"],
            name: result["error"]["name"]
        })
        return
    }

    req["body"] = result.data;

    next();
}


export {
    userSchemaValidate, emailChecker, emailValidator
}
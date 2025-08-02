import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { generateOTP } from "../../utils/application";
import sendMail from "../../utils/nodemailer";
import { redisDeleteOtp, redisGetOtp, redisStoreOtp } from "../../utils/redis";
import { Next, Req, Res, User } from "../../utils/types";
import prismaClient from "../../db";
import jwt from "jsonwebtoken"


async function storeOTPRedisSendEmail(req: Req, res: Res, next: Next) {
    const user: User = req["body"];
    const otp = generateOTP();

    try {
        const response = await redisStoreOtp({
            ...user,
            otp
        });

        try {
            await sendMail({
                otp, mail: user["email"]
            })

            next();

        } catch (error) {
            next(error);
        }


    } catch (error) {
        next(error)
    }
}

async function verifyOtpAndStoreUser(req: Req, res: Res, next: Next) {
    const { email, otp }: { email: string; otp: number; } = req["body"];

    try {
        const response = await redisGetOtp(email);

        if (!response) {
            res.status(StatusCodes.REQUEST_TIMEOUT).json({
                phrase: ReasonPhrases.REQUEST_TIMEOUT,
                msg: "OTP expired"
            })
            return
        }

        const output: {
            email: string;
            username: string;
            firstname: string;
            lastname: string;
            password: string;
            otp: number;
        } = JSON.parse(response);

        if (otp !== output["otp"]) {
            res.status(StatusCodes.CONFLICT).json({
                phrase: ReasonPhrases.CONFLICT,
                msg: "Incorrect Password"
            })
            return;
        }


        try {
            await redisDeleteOtp(email);

            try {
                const response = await prismaClient.user.create({
                    data: {
                        email: output["email"],
                        password: output["password"],
                        firstname: output["firstname"],
                        lastname: output["lastname"]
                    }, select: {
                        email: true,
                        id: true
                    }
                })

                if (!process.env.jwtPassword) {
                    next(new Error("Jwt password does not exist"));
                    return
                }

                const token: string = jwt.sign({
                    id: response["id"],
                    email: response["email"]
                }, process.env.jwtPassword);

                req["token"] = token;

                next();
            } catch (error) {
                next(error);
            }
        } catch (error) {
            next(error);
        }

    } catch (error) {
        next(error);
    }
}

export {
    storeOTPRedisSendEmail, verifyOtpAndStoreUser
}
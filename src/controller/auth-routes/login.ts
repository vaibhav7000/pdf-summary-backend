import { Req, Res, Next, RedisMailPayload } from "../../utils/types";
import prismaClient from "../../db";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import jwt from "jsonwebtoken";
import { generateOTP, generateToken } from "../../utils/application";
import { redisDeleteOtp, redisGetOtp, redisStoreOtp } from "../../utils/redis";
import sendMail from "../../utils/nodemailer";

async function userCheckerAndToken(req: Req, res: Res, next: Next) {
    const { email, password }: { email: string, password: string } = req["body"];

    try {
        const response = await prismaClient.user.findUnique({
            where: {
                email
            }
        })

        if (!response) {
            res.status(StatusCodes.FORBIDDEN).json({
                phrase: ReasonPhrases.FORBIDDEN,
                msg: "User with this email does not exist"
            })
            return;
        }

        // perfor hashing with passwords please

        if (password !== response["password"]) {
            res.status(StatusCodes.FORBIDDEN).json({
                phrase: ReasonPhrases.FORBIDDEN,
                msg: "Password is incorrect"
            })
            return;
        }

        const token: string = generateToken({
            email: response["email"],
            id: response["id"]
        })

        req["token"] = token;

        next()
    } catch (error) {
        next(error);
    }
}

async function userCheckerAndStoreOTP(req: Req, res: Res, next: Next) {
    const { email } = req["body"];
    const otp = generateOTP();

    try {
        const result = await prismaClient.user.findUnique({
            where: {
                email
            }
        })

        if(!result) {
            res.status(StatusCodes.CONFLICT).json({
                phrase: ReasonPhrases.CONFLICT,
                msg: "User with this email does not exist"
            })
            return;
        }


        try {
            const response = await redisStoreOtp({
                otp, email, id: result["id"]
            });

            try {
                sendMail({
                    otp, mail: email
                })

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

async function verifOTPAndToken(req: Req, res: Res, next: Next) {
    const { email, otp }: { email: string, otp: number } = req["body"];

    try {
        const response = await redisGetOtp(email);

        if (!response) {
            res.status(StatusCodes.REQUEST_TIMEOUT).json({
                phrase: ReasonPhrases.REQUEST_TIMEOUT,
                msg: "OTP is expired"
            })
            return
        }

        const output: RedisMailPayload = JSON.parse(response);

        if (otp !== output["otp"]) {
            res.status(StatusCodes.CONFLICT).json({
                phrase: ReasonPhrases.CONFLICT,
                msg: "Incorrect OTP",
            })

            return;
        }

        try {
            await redisDeleteOtp(email);

            const token: string = generateToken({
                email: output["email"],
                id: output["id"]!
            });

            req["token"] = token

            next();
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export {
    userCheckerAndToken, userCheckerAndStoreOTP, verifOTPAndToken
}
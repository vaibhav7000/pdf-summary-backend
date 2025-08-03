import jwt from "jsonwebtoken";
import { Next, Req, Res } from "../../utils/types";
import { jwtPayload, tokenSchema } from "../../utils/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prismaClient from "../../db";

function verifyToken(req: Req, res: Res, next: Next) {
    const token: string | undefined = req["headers"]["authorization"];

    const result = tokenSchema.safeParse({
        token
    });

    if(!result.success) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            phrase: ReasonPhrases.UNAUTHORIZED,
            msg: "Token schema is invalid"
        })
        return;
    }

    try {
        if(!process.env.jwtPassword) {
            next(new Error("jwt password is invalid"));
            return
        }

        const finalToken: string | undefined = result["data"]["token"].split(" ")[1];

        if(!finalToken) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                phrase: ReasonPhrases.UNAUTHORIZED,
                msg: "Token schema is invalid"
            });
            return;
        }

        const verify = jwt.verify(finalToken, process.env.jwtPassword);

        const finalResult = jwtPayload.safeParse(verify);

        if(!finalResult.success) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                phrase: ReasonPhrases.UNAUTHORIZED,
                msg: "You have jwt secret",
            })
            return;
        }

        req["decode"] = finalResult["data"];

        next();
    } catch (error) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            phrase: ReasonPhrases.UNAUTHORIZED,
            msg: "Token is incorrect"
        })
    }
}

async function userFreeTier(req: Req, res: Res, next: Next) {
    const decode = req["decode"];

    if(!decode) {
        res.status(StatusCodes.UNAUTHORIZED).json({
            phrase: ReasonPhrases.UNAUTHORIZED,
            msg: "In valid Token"
        })
        return;
    }

    const { id }: {id: number} = decode;

    try {
        const response = await prismaClient.pdf.findMany({
            where: {
                userId: id
            }
        })

        if(response.length >= 5) {
            res.status(StatusCodes.UNAUTHORIZED).json({
                phrase: ReasonPhrases.UNAUTHORIZED,
                msg: "You have exhausted free tier",
            })
            return
        }

        next()
    } catch (error) {
        next(error);
    }
}

export {
    verifyToken, userFreeTier
}

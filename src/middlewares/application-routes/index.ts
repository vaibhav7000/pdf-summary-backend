import jwt from "jsonwebtoken";
import { Next, Req, Res } from "../../utils/types";
import { jwtPayload, tokenSchema } from "../../utils/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prismaClient from "../../db";
import { getSignedURL } from "../../utils/supabase/supabase";

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

async function getPdfBuffer(req: Req, res: Res, next: Next) {
    const id = req.params.id;

    if(!id) {
        res.status(StatusCodes.LENGTH_REQUIRED).json({
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            msg: "Invalid id"
        })
        return;
    }

    const pdfId = parseInt(id);
    if(!pdfId) {
        res.status(StatusCodes.LENGTH_REQUIRED).json({
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            msg: "Invalid id"
        })
        return;
    }

    try {
        const response = await prismaClient.pdf.findUnique({
            where: {
                id: pdfId
            }, select: {
                link: true,
                title: true,
                search: true
            }
        });

        if(!response) {
            res.status(StatusCodes.NOT_FOUND).json({
                phrase: ReasonPhrases.NOT_FOUND,
                msg: "No pdf found with this ID"
            })
            return
        }

        try {
            let downloadResponse = await fetch(response.link);

            if (downloadResponse.status !== StatusCodes.FORBIDDEN) {
                const signedURL = await getSignedURL(response.title);

                if('message' in signedURL) {
                    throw new Error(signedURL.message);
                } 

                try {
                    downloadResponse = await fetch(signedURL.signedUrl);

                    try {
                        prismaClient.pdf.update({
                            where: {
                                id: pdfId
                            }, data: {
                                link: signedURL.signedUrl
                            }
                        })
                    } catch (error) {
                        next(error);
                    }
                } catch (error) {
                    next(error);
                }
            }

            const bf = await downloadResponse.arrayBuffer();
            const buffer = Buffer.from(bf);

            req["buffer"] = buffer;
            req["search"] = response["search"];

            next();
        } catch (error) {
            next(error);
        }
    } catch (error) {
        next(error);
    }
}

export {
    verifyToken, userFreeTier, getPdfBuffer
}

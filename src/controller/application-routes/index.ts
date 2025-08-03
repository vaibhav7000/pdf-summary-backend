import multer from "multer";
import getTextFromBuffer from "../../utils/pdf-parser";
import storePdf from "../../utils/supabase/supabase";
import { Next, Req, Res } from "../../utils/types";
import prismaClient from "../../db";
import aiSummarizer from "../../utils/gemini";
import { ReasonPhrases, StatusCodes } from "http-status-codes";


async function storePDFSupabase(buffer: Buffer, filename: string) {
    try {
        const response = await storePdf(filename, buffer);
        return response;
    } catch (error) {
        throw error;
    }
}


async function getSummaryGemini(text: string, buffer: Buffer): Promise<string | undefined> {
    try {
        const result = await aiSummarizer(text, buffer);
        return result;
    } catch (error) {
        throw error;
    }
}


async function summaryAndStore(req: Req, res: Res, next: Next): Promise<void> {
    const file = req["file"];
    const decode = req["decode"];
    const search: string = req["body"].search || "Summary of the text";

    if (!decode) {
        throw new Error("Token does not exist");
    }

    const { id, email } = decode;

    if (!file) {
        next(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
        return;
    }

    // const pdfText: string = await getTextFromBuffer(file.buffer);

    const filename: string = `${email}/${file.originalname}`;

    try {
        const response = await storePDFSupabase(file.buffer, filename);

        if('message' in response) {
            res.status(StatusCodes.BAD_REQUEST).json({
                phrase: ReasonPhrases.BAD_REQUEST,
                msg: response["message"],
            })
            return
        }
        
        try {
            await actionsOnPDFTable(id, filename, response.signedUrl);


            try {
                const summary = await getSummaryGemini(search, file["buffer"]);

                res.status(StatusCodes.CREATED).json({
                    phrase: ReasonPhrases.CREATED,
                    summary
                })

            } catch (error) {
                next(error);
            }
        } catch (error) {
            next(error);
        }
    } catch (error) {

    }

}

async function actionsOnPDFTable(id: number, title: string, link: string) {
    try {
        const response = await prismaClient.pdf.create({
            data: {
                userId: id,
                title,
                link
            }
        })
    } catch (error) {
        throw error;
    }
}

export default summaryAndStore
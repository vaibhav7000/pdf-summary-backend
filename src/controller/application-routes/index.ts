import multer from "multer";
import getTextFromBuffer from "../../utils/pdf-parser";
import storePdf from "../../utils/supabase/supabase";
import { Next, Req, Res } from "../../utils/types";
import prismaClient from "../../db";
import aiSummarizer from "../../utils/gemini";


async function storePDFSupabase(buffer: Buffer, filename: string) {
    try {
        const response = await storePdf(filename, buffer);
        return response;
    } catch (error) {
        throw error;
    }
}


async function getSummaryGemini(text: string, summaryText: string) {

}


async function summaryAndStore(req: Req, res: Res, next: Next): Promise<void> {
    const file = req["file"];
    const decode = req["decode"];

    if(!decode) {
        next(new Error());
        return
    }

    const { id } = decode;

    if(!file) {
        next(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
        return;
    }

    try {
        // const pdfText: string = await getTextFromBuffer(file.buffer);

        const filename: string = `${file.originalname} ${new Date()}`

        const response = await storePDFSupabase(file.buffer, filename)

        await actionsOnPDFTable(id, response["id"], response["fullPath"]);

        await aiSummarizer("", file["buffer"]);

        next();
    } catch (error) {
        next(error);
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

        console.log("pdf table altered");
    } catch (error) {
        throw error;
    }
}

export default summaryAndStore
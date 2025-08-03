import multer from "multer";
import getTextFromBuffer from "../../utils/pdf-parser";
import storePdf from "../../utils/supabase/supabase";
import { Next, Req, Res } from "../../utils/types";


async function storePDFSupabase(buffer: Buffer, filename: string): Promise<void> {
    try {
        await storePdf(filename, buffer);
    } catch (error) {
        throw error;
    }
}


async function getSummaryGemini(text: string, summaryText: string) {

}


async function summaryAndStore(req: Req, res: Res, next: Next): Promise<void> {
    const file = req["file"];

    if(!file) {
        next(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
        return;
    }

    try {
        const pdfText: string = await getTextFromBuffer(file.buffer);
        console.log("text generation ++");

        const filename: string = `${file.originalname} ${new Date().toDateString()}`

        const response = await storePDFSupabase(file.buffer, filename)

        next();
    } catch (error) {
        next(error);
    }
}

export default summaryAndStore